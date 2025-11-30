// server/babel.config.js
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current', // Use the current Node.js version
        },
      },
    ],
  ],
};