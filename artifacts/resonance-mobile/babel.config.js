module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo', { unstable_transformImportMeta: true }]],
    // three.js (Phase 4 3-D scene) ships static class blocks, which the
    // production (minified) Metro transform does not enable by default.
    // Scoped to three.js only: applying it globally breaks the
    // reanimated/worklets Babel plugin (NumericLiterals exception).
    overrides: [
      {
        test: /node_modules[\\/](\.pnpm[\\/][^\\/]+[\\/]node_modules[\\/])?three[\\/]/,
        plugins: ['@babel/plugin-transform-class-static-block'],
      },
    ],
  };
};
