import { memo } from 'react';
import type { FC } from 'react';

import resets from '../../_resets.module.css';
import classes from './Component1.module.css';
import { UnionIcon } from './UnionIcon.js';

interface Props {
  className?: string;
}
/* @figmaId 1:47 */
export const Component1: FC<Props> = memo(function Component1(props = {}) {
  return (
    <div className={`${resets.storybrainResets} ${classes.root}`}>
      <div className={classes.rectangle1}></div>
      <div className={classes.union}>
        <UnionIcon className={classes.icon} />
      </div>
    </div>
  );
});
