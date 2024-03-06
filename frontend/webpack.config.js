const WebpackObfuscator = require('webpack-obfuscator');

module.exports = {
  // ... other configuration options

  plugins: [
    new WebpackObfuscator({
      // Options for obfuscator
      rotateStringArray: true,
      stringArray: true,
      // Add other options as needed
    }),
    // ... other plugins
  ],
};
