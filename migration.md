Migrate Swipeable v4 to v5
=========================

### Simple Component usage:
The component usage for swiped events is the same
```diff
- import Swipeable from 'react-swipeable';
+ import { Swipeable } from 'react-swipeable;

<Swipeable
  onSwipedLeft={this.swipedLeft}
  onSwipedRight={this.swipedRight} />
```

### Swiping direction usage:
The props for swiping directions have been removed. Use the `dir` property from `onSwiping` to determine direction.
```diff
- import Swipeable from 'react-swipeable';
+ import {
+   Swipeable,
+   LEFT,
+   RIGHT,
+   UP,
+   DOWN,
+ } from 'react-swipeable;

+ const onSwiping = (dir) => {
+   if (dir === LEFT)  console.log('Swiping - LEFT');
+   if (dir === RIGHT) console.log('Swiping - RIGHT');
+   if (dir === UP)    console.log('Swiping - UP');
+   if (dir === DOWN)  console.log('Swiping - DOWN');
+ }

<Swipeable
-   onSwipingLeft={swipingLeft}
-   onSwipingRight={swipingRight}
-   onSwipingUp={swipingUp}
-   onSwipingDown={swipingDown}
+   onSwiping={({dir}) => onSwiping(dir) }
  />
```