module.exports = function(api) {
  api.cache(false);

  const presets = [
    ['@babel/env']
  ];

  const plugins = [];

  return {
    presets,
    plugins,
    comments: true
  };
};
