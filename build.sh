if [ -f is-installed ]; then
  echo > is-installed
  npm install
  npm run build
  rm -rf node_modules examples rollup.config.js
else
  echo "Skipping installation hook."
  rm -f is-installed
fi
