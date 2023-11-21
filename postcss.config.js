const postcssNormalize = require('postcss-normalize');

module.exports = {
  plugins: [
    [
      "postcss-preset-env",
      {
        autoprefixer: {
          flexbox: "no-2009",
        },
        stage: 3,
      }
    ],
    postcssNormalize(),
    require('postcss-pxtorem')({
      rootValue: 192,
      unitPrecision: 5,
      replace: true,
      mediaQuery: false,
      minPixelValue: 0,
      selectorBlackList: [], //过滤
      propList: ['*'],
    }),
   
    require('autoprefixer')({
      overrideBrowserslist: ['last 2 version', '>1%', 'ios 7']
    })
  ],
};


// module.exports = ({ file }) => {
//   let remUnit
//   if (file && file.dirname && file.dirname.indexOf("vant")>-1) {
//       remUnit = 37.5
//   } else {
//       remUnit = 75
//   }
//   return {
//       plugins: {
//           'postcss-pxtorem': {
//               rootValue: remUnit,
//               propList: ['*']
//           },
//           'autoprefixer': {}
//       }
//   }
// }