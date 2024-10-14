# Contributing

Thanks for contributing!

## Before you contribute

This package tries to keep a small footprint/package size by limiting its scope and concerns. It's mainly used as a building block for more complex custom features.

With this in mind feature requests and PRs that greatly expand its scope will likely not move forward, but we are open to discussing them.

We encourage pull requests concerning:

- Bugs in this library
- New tests for React
- Documentation

## Development

Initial install & setup, with **node 16** & **yarn v1**, run `yarn install`.

Make changes/updates to the `src/index.ts` file.

**_Please add/update tests if PR adds/changes functionality._**

### Verify updates with the examples

Build, run, and test examples locally:

```sh
# Yarn install
yarn install
# Run the start:dev:local command
yarn start:examples:local
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

## Documentation

Documentation is managed within the `docs` directory. In order to test and preview changes, you'll require Node 18+ to run locally.

```sh
# navigate to docs directory
cd docs
# install modules
docs$ yarn install
# start locally and view at http://localhost:3000/
docs$ yarn start
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

### Using changesets

Our official release path is to use automation to perform the actual publishing of our packages. The steps are to:

1. A human developer adds a changeset. Ideally this is as a part of a PR that will have a version impact on a package.
2. On merge of a PR our automation system opens a "Version Packages" PR.
3. On merging the "Version Packages" PR, the automation system publishes the packages.

Here are more details:

### Add a changeset

When you would like to add a changeset (which creates a file indicating the type of change), in your branch/PR issue this command:

```sh
$ yarn changeset
```

to produce an interactive menu. Navigate the packages with arrow keys and hit `<space>` to select 1+ packages. Hit `<return>` when done. Select semver versions for packages and add appropriate messages. From there, you'll be prompted to enter a summary of the change. Some tips for this summary:

1. Aim for a single line, 1+ sentences as appropriate.
2. Include issue links in GH format (e.g. `#123`).
3. You don't need to reference the current pull request or whatnot, as that will be added later automatically.

After this, you'll see a new uncommitted file in `.changesets` like:

```sh
$ git status
# ....
Untracked files:
  (use "git add <file>..." to include in what will be committed)
	.changeset/flimsy-pandas-marry.md
```

Changeset will use a randomly generated file name for the markdown description file.

Review the file, make any necessary adjustments, and commit it to source. When we eventually do a package release, the changeset notes and version will be incorporated!

### Creating versions

On a merge of a feature PR, the changesets GitHub action will open a new PR titled `"Version Packages"`. This PR is automatically kept up to date with additional PRs with changesets. So, if you're not ready to publish yet, just keep merging feature PRs and then merge the version packages PR later.

### Publishing packages

On the merge of a version packages PR, the changesets GitHub action will publish the packages to npm.

## Project Maintainers

### Manual publish method

<detail>
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

</detail>

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
