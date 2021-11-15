const esbuild = require("esbuild");
const chalk = require("chalk");

const log = console.log;

function convertToKb(byte) {
  return `${byte / 1000} kb`;
}

function printResult(outputs) {
  // Filter out .map files
  const jsFiles = Object.keys(outputs).filter((f) => !f.endsWith(".map"));

  jsFiles.forEach((file) => {
    log(
      `${chalk.blue(`${file}:`)} ${chalk.green(
        convertToKb(outputs[file].bytes)
      )}`
    );
  });
}

const baseConfig = {
  entryPoints: ["./src/index.ts"],
  bundle: true,
  sourcemap: true,
  minify: false,
  external: ["react"],
  metafile: true,
};

/**
 * CJS Build
 */
esbuild
  .build({
    ...baseConfig,
    format: "cjs",
    outfile: "dist/react-swipeable.js",
  })
  .then((result) => printResult(result.metafile.outputs))
  .catch(() => process.exit(1));

esbuild
  .build({
    ...baseConfig,
    format: "cjs",
    minify: true,
    outfile: "dist/react-swipeable.min.js",
  })
  .then((result) => printResult(result.metafile.outputs))
  .catch(() => process.exit(1));

/**
 * ESM Build
 */
esbuild
  .build({
    ...baseConfig,
    format: "esm",
    outfile: "dist/react-swipeable.es.js",
  })
  .then((result) => printResult(result.metafile.outputs))
  .catch(() => process.exit(1));

esbuild
  .build({
    ...baseConfig,
    format: "esm",
    minify: true,
    outfile: "dist/react-swipeable.es.min.js",
  })
  .then((result) => printResult(result.metafile.outputs))
  .catch(() => process.exit(1));
