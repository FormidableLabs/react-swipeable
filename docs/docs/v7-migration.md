# v7 migration guide

## :construction: Major Changes / Breaking Changes :construction:

- we have dropped support for `es5` transpiled output
  - we target `es2015` for our transpilation now
    - `swipeable` utilizes object/array spread & const/let natively
- `preventScrollOnSwipe` - "new" prop. Replaces `preventDefaultTouchmoveEvent`
  - same functionality but renamed to be more explicit on its intended use
  - **fixed bug** - where toggling this prop did not re-attach event listeners
  - **update** - we now **only** change the `passive` event listener option for `touchmove` depending on this prop
    - see notes in api docs for more details on [passive-listener](api#passive-listener-details)

### Typescript changes
- Added a **ton** of comments to the types that should now show up in IDEs.

## Migrate Swipeable v6 to v7

If you you're currently utilizing `preventDefaultTouchmoveEvent` you should be able to simply replace its usage with `preventScrollOnSwipe`.

```diff
const handlers = useSwipeable({
-  preventDefaultTouchmoveEvent: true,
+  preventScrollOnSwipe: true,
});
```
