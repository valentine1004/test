module.exports = {
  presets: [
    [
      '@vue/app',
      {
        useBuiltIns: 'entry'
      }
    ]
  ],
  plugins: [[require('@babel/plugin-proposal-optional-chaining')]]
}
