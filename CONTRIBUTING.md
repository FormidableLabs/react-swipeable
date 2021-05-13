# Contributing

Thanks for contributing!

## Before you contribute

This package tries to keep a small footprint/package size by limiting its scope and concerns. It's mainly used as a building block for more complex custom features.

With this in mind feature requests and PRs that greatly expand its scope will likely not move forward, but we are open to discussing them.

We encourage pull requests concerning:

* Bugs in this library
* New tests for React
* Documentation

## Development

Initial install & setup, with **node 10+** & **yarn v1**, run `yarn install`.

Make changes/updates to the `src/index.ts` file.

**_Please add/update tests if PR adds/changes functionality._**

### Verify updates with the examples

Build, run, and test examples locally:
```bash
# Go into examples folder
react-swipeable$ cd examples
# Yarn install
react-swipeable/examples$ yarn
# Run the start:dev:local command
react-swipeable/examples$ yarn start:dev:local
```

Then open a browser tab to `http://localhost:8080/`.

You can now make updates/changes to `src/index.ts` and webpack will rebuild, then reload the page so you can test your changes!

## Testing

Our builds run unit tests, lint, prettier, compile/build, and watch package size via [size-limit](https://github.com/ai/size-limit/).

All these steps can be verified via a single command.
```sh
# validate all the things
yarn test
```

### Unit Testing

All unit tests are located in:

- `__tests__/useSwipeable.spec.tsx`

These run in node using `jest` and [@testing-library/react](https://github.com/testing-library/react-testing-library).

```sh
# run all tests
$ yarn run test:unit

# run all tests and watch for changes
$ yarn run test:unit:watch
```

### Lint & Formatting

We've attempted to standardize our lint and format with `eslint` and `prettier`. The build will fail if these fail.

```sh
# run lint
$ yarn run lint

# run prettier
$ yarn run prettier

# fix prettier errors & reformat code
$ yarn run format
```

## Releasing a new version to NPM

_Only for project administrators_

```sh
# (1) Runs tests, lint, build published dir, updates package.json
$ npm version [patch|minor|major|<version>]

# (2) If all is well, publish the new version to the npm registry
$ npm publish

# (3) Then, update github and push new associated tag
$ git push --follow-tags
```
