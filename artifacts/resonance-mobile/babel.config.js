module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo', { unstable_transformImportMeta: true }]],
    // three.js (Phase 4 3-D scene) ships static class blocks, which the
    // production (minified) Metro transform does not enable by default.
    plugins: ['@babel/plugin-transform-class-static-block'],
  };
};
