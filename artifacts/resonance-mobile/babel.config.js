module.exports = function (api) {
  api.cache(true);
  return {
    // require.resolve everywhere: EAS export spawns Metro workers whose cwd
    // is the monorepo root, where bare preset/plugin names don't resolve in
    // this pnpm layout.
    presets: [[require.resolve('babel-preset-expo'), { unstable_transformImportMeta: true }]],
    // three.js (Phase 4 3-D scene) ships static class blocks, which the
    // production (minified) Metro transform does not enable by default.
    // Scoped to three.js only: applying it globally breaks the
    // reanimated/worklets Babel plugin (NumericLiterals exception).
    // Explicitly register the worklets plugin (must be last): in this pnpm
    // monorepo babel-preset-expo fails to auto-apply it, leaving reanimated's
    // worklets untransformed — crashes on-device with "Only worklets can be
    // executed synchronously on UI runtime".
    plugins: [require.resolve('react-native-worklets/plugin')],
    overrides: [
      {
        test: /node_modules[\\/](\.pnpm[\\/][^\\/]+[\\/]node_modules[\\/])?three[\\/]/,
        plugins: [require.resolve('@babel/plugin-transform-class-static-block')],
      },
      // react-native 0.81 ships class private fields (e.g. DOMRect #width),
      // which hermesc rejects when compiling bytecode for EAS Update exports.
      // Scoped to react-native only, mirroring the three.js override above.
      {
        test: /node_modules[\\/](\.pnpm[\\/][^\\/]+[\\/]node_modules[\\/])?react-native[\\/]/,
        plugins: [
          require.resolve('@babel/plugin-transform-class-properties'),
          require.resolve('@babel/plugin-transform-private-methods'),
          require.resolve('@babel/plugin-transform-private-property-in-object'),
        ],
      },
    ],
  };
};
