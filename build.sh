#!/usr/bin/env sh
if [ -f is-installed ]; then
  echo "Skipping installation hook."
  rm -f is-installed
else
  echo > is-installed
  npm install
  npm run build
  rm -rf package-lock.json node_modules/ examples/ rollup.config.js
fi
