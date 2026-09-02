"""给笔记正文里含中文、尚未双语的块级元素套上 zh/en span。

只改这些元素的 innerHTML 区间,文件其余部分逐字节不动 —— 所以先用 bs4
定位,再拿 sourceline/sourcepos 回到原始字符串上按标签配对切片。

  python3 scripts/i18n-wrap.py extract notes/x.html
  python3 scripts/i18n-wrap.py apply   notes/x.html t.py
  python3 scripts/i18n-wrap.py check   notes/x.html
"""
import re, sys
from bs4 import BeautifulSoup

CJK = re.compile(r'[\u4e00-\u9fff]')
# 纯行内标签:出现在文字流里,不单独包裹
INLINE = {'strong', 'b', 'em', 'i', 'code', 'a', 'small', 'sup', 'sub', 'u',
          'mark', 'kbd', 'abbr', 'br', 'wbr', 'span', 'time', 'cite', 'q'}
# span 只有在这些父元素里才算行内;挂在 div 下的 span 视作独立块
TEXTFLOW = {'p', 'li', 'td', 'th', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'blockquote', 'figcaption', 'dt', 'dd', 'caption', 'a', 'strong',
            'em', 'code', 'small', 'b', 'i', 'sup', 'sub', 'span', 'label'}


def is_inline(el):
    """这个后代会不会阻止父元素被整体包裹。"""
    # 自身不含中文的元素纯属装饰(公式里的高亮 span、图标 div),不该挡路
    if not CJK.search(el.decode_contents()):
        return True
    if el.name not in INLINE:
        return False
    # 带中文的 span:在文字流里算行内,挂在 div 下则是独立标签
    if el.name == 'span':
        return el.parent is not None and el.parent.name in TEXTFLOW
    return True


def already_bi(el):
    return el.find(class_='i18n-zh') is not None or el.find(class_='i18n-en') is not None


def in_i18n(el):
    cls = set(el.get('class') or [])
    if 'i18n-zh' in cls or 'i18n-en' in cls:
        return True
    for p in el.parents:
        cls = set(p.get('class') or [])
        if 'i18n-zh' in cls or 'i18n-en' in cls:
            return True
    return False


def is_target(el):
    """含中文、未双语、且内部只剩行内元素 —— 就是可以整体包裹的最小单元。"""
    if el.name in ('script', 'style', 'pre'):
        return False
    if already_bi(el) or in_i18n(el):
        return False
    if not CJK.search(el.decode_contents()):
        return False
    return all(is_inline(d) for d in el.find_all(True))


def line_offsets(src):
    offs, pos = [0], 0
    for ln in src.split('\n'):
        pos += len(ln) + 1
        offs.append(pos)
    return offs


def abs_pos(offs, el):
    return offs[el.sourceline - 1] + el.sourcepos


def inner_span(src, start, tag):
    """返回 (innerHTML 起, innerHTML 止, 整个元素结束位置)。"""
    open_end = src.index('>', start) + 1
    if src[open_end - 2] == '/':
        return open_end, open_end, open_end
    pat = re.compile(r'</?' + re.escape(tag) + r'(?=[\s/>])', re.I)
    depth, i = 1, open_end
    while True:
        m = pat.search(src, i)
        if not m:
            raise ValueError(f'未找到 </{tag}> 的配对,起点 {start}')
        gt = src.index('>', m.start()) + 1
        if src[m.start() + 1] == '/':
            depth -= 1
            if depth == 0:
                return open_end, m.start(), gt
        elif src[gt - 2] != '/':
            depth += 1
        i = gt


def collect(path):
    src = open(path, encoding='utf-8').read()
    soup = BeautifulSoup(src, 'html.parser')
    prose = soup.find('div', class_='prose')
    offs = line_offsets(src)
    out = []
    if prose is None:
        return src, out
    seen = []
    for el in prose.find_all(True):
        if not is_target(el):
            continue
        # 取最外层:若某个祖先已被选中,跳过
        if any(a in seen for a in el.parents):
            continue
        seen.append(el)
        start = abs_pos(offs, el)
        assert src[start] == '<', f'定位失败 @{start}: {src[start:start+40]!r}'
        a, b, _ = inner_span(src, start, el.name)
        out.append({'el': el, 'a': a, 'b': b, 'zh': src[a:b]})
    return src, out


def cmd_extract(path):
    src, tg = collect(path)
    sys.stdout.reconfigure(encoding='utf-8')
    print(f"# {path}  待翻译块 {len(tg)} 个")
    for i, x in enumerate(tg):
        el = x['el']
        cls = '.' + '.'.join(el.get('class')) if el.get('class') else ''
        print(f"[{i}] <{el.name}{cls}> {re.sub(r'\\s+', ' ', x['zh']).strip()}")


def cmd_apply(path, tpath):
    ns = {}
    exec(open(tpath, encoding='utf-8').read(), ns)
    T = ns['T']
    src, tg = collect(path)
    assert len(T) == len(tg), f"译文 {len(T)} 条 != 待翻译块 {len(tg)} 个"
    for x, en in sorted(zip(tg, T), key=lambda p: -p[0]['a']):
        zh = x['zh'].strip()
        rep = (f'<span lang="zh-CN" class="i18n-zh">{zh}</span>'
               f'<span lang="en" class="i18n-en">{en}</span>')
        src = src[:x['a']] + rep + src[x['b']:]
    open(path, 'w', encoding='utf-8').write(src)
    print(f"✓ {path}: 回填 {len(T)} 块")


def cmd_check(path):
    src = open(path, encoding='utf-8').read()
    m = re.search(r'<div class="prose">(.*?)</article>', src, re.S)
    pr = m.group(1)
    zh = len(re.findall(r'class="i18n-zh"', pr))
    en = len(re.findall(r'class="i18n-en"', pr))
    _, left = collect(path)
    print(f"{path}: zh={zh} en={en} {'✓' if zh == en else '✗ 不配平'}  剩余未双语块={len(left)}")


if __name__ == '__main__':
    {'extract': cmd_extract, 'apply': cmd_apply, 'check': cmd_check}[sys.argv[1]](*sys.argv[2:])
