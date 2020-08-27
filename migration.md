# React Swipeable v6 changes and migration

## Major Changes

- removal of `<Swipeable>` component
  - _TODO_ add example for creating one and migrating
- update calculation of `deltaX` and `deltaY` from `initial - current` to `current - initial`
  - Example: `const deltaX = state.xy[0] - x;` is now `const deltaX = x - state.xy[0];`

## Migrate Swipeable v5 to v6
