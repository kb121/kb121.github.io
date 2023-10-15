import { memo } from 'react';
import type { FC } from 'react';

import resets from '../../_resets.module.css';
import classes from './Component2.module.css';

interface Props {
  className?: string;
}
/* @figmaId 1:48 */
export const Component2: FC<Props> = memo(function Component2(props = {}) {
  return (
    <div className={`${resets.storybrainResets} ${classes.root}`}>
      <div className={classes.nav}></div>
      <div className={classes.hong}>Hong </div>
      <div className={classes.lIInBug1}></div>
    </div>
  );
});
