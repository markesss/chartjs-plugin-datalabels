const {resolve} = require('path');

module.exports = ({defaults}) => {
  function render(md) {
    const fence = md.renderer.rules.fence;
    md.renderer.rules.fence = (...args) => {
      const [tokens, idx] = args;
      const token = tokens[idx];
      const lang = token.info.trim();

      if (!(/ chart-editor( |$)/).test(lang)) {
        return fence(...args);
      }

      return `<chart-editor :code="\`${token.content}\`"/>`;
    };
  }

  return {
    name: 'vuepress-plugin-chart-editor',
    enhanceAppFiles: [
      {
        name: 'chart-defaults',
        content: `
          import { Chart, BarController, LineController, DoughnutController, PolarAreaController, RadarController, BubbleController, ArcElement, PointElement, LineElement, BarElement, CategoryScale, LinearScale, RadialLinearScale } from 'chart.js';
          Chart.register(BarController, LineController, DoughnutController, PolarAreaController, RadarController, BubbleController, ArcElement, PointElement, LineElement, BarElement, CategoryScale, LinearScale, RadialLinearScale );
          Chart.defaults.set(${JSON.stringify(defaults)});
        `
      },
      resolve(__dirname, 'global.js'),
      resolve(__dirname, 'enhancer.js'),
    ],
    chainWebpack: (config) => {
      config.merge({
        externals: {
          moment: 'moment',
        },
      });
    },
    chainMarkdown: (config) => {
      config
        .plugin('chart-editor')
        .use(render)
        .end();
    },
  };
};
