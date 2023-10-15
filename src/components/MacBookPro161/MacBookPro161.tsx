import { memo } from 'react';
import type { FC } from 'react';

import resets from '../_resets.module.css';
import { Component1 } from './Component1/Component1';
import { Component2 } from './Component2/Component2';
import classes from './MacBookPro161.module.css';

interface Props {
  className?: string;
}
/* @figmaId 1:14 */
export const MacBookPro161: FC<Props> = memo(function MacBookPro161(props = {}) {
  return (
    <div className={`${resets.storybrainResets} ${classes.root}`}>
      <Component2 />
      <Component1 />
      <div className={classes.frame1}>
        <div className={classes.lifeIsFantastic}>Life is fantastic</div>
      </div>
      <div className={classes.frame2}>
        <div className={classes.copyright2023HongZhuangAllRigh}>
          <div className={classes.textBlock}>Copyright © 2023 Hong Zhuang</div>
          <div className={classes.textBlock2}>All rights reserved.</div>
        </div>
      </div>
    </div>
  );
});
