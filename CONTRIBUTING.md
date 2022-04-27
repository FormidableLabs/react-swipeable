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
```sh
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

If you see this error:
```
[warn] Code style issues found in the above file(s). Forgot to run Prettier?
```
Then run the formatter:
```sh
$ yarn run format
```

## Project Maintainers
### Releasing a new version
1. Publish to npm
2. Update version in `examples`

#### 1. Publish to npm
```sh
# (1) Runs tests, lint, build published dir, updates package.json
$ npm version [patch|minor|major|<version>]

# (2) If all is well, publish the new version to the npm registry
$ npm publish

# (3) Then, update github and push new associated tag
$ git push --follow-tags
```

#### 2. Update version in the examples

After publishing a new version to npm we need to make sure the `examples` get updated.
1. Bump the `react-swipeable` version in `examples/package.json` to the new just released version
2. Run `yarn` to install and update the lock file
3. Push changes to `main` branch so the codesandbox examples get updated
4. Build and deploy updated examples to github pages

### Building and deploying examples to github pages

The examples build using the most recent version of `react-swipeable`.

Make sure you've already completed the above steps for `Update version in the examples` so the `examples` have the most recent version installed.

(Optional) Validate examples build locally
```sh
# From root - build the examples
$ yarn examples:build

# cd into examples and start simple http server(python v3)
# validate everything works locally: http://localhost:8080/
$ cd examples
examples$ python -m http.server 8080
```

```sh
# From root - build and publish the examples app to github pages
$ yarn examples:build:publish
```
