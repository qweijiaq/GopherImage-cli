const { last } = require('lodash');
const { pascalCase } = require('../app/app.service');

/**
 * 获取目标组件路径
 */
const getTargetComponentPath = (api, options) => {
  return Object.keys(api.generator.files).filter((file) =>
    file.includes(`${options.to}.vue`),
  )[0];
};

/**
 * 获取组件导入声明
 */
const getComponentImportStatement = (importComponentPath) => {
  return importComponentPath
    .map((item) => {
      // 组件名
      const componentName = pascalCase(
        last(item.split('/')).replace('.vue', ''),
      );

      // 组件路径
      const componentPath = item.replace('src/', '@/').replace('.vue', '');
      return { name: componentName, path: componentPath };
    })
    .map((item) => {
      return `import ${item.name} from '${item.path}';`;
    });
};

/**
 * 获取导入组件文件路径
 */
const getImportComponentPath = (api, options) => {
  const { importComponent } = options;

  return Object.keys(api.generator.files).filter((file) =>
    importComponent.split(',').some((item) => file.includes(`${item}.vue`)),
  );
};

/**
 * 获取导入 Vuex 帮手方法
 */
const getVuexImportHelpers = (api, options) => {
  const { importVuex } = options;

  // Vuex 帮手方法
  const vuexHelpers = [
    {
      name: 'mapState',
      abbr: 'ms',
    },
    {
      name: 'mapGetters',
      abbr: 'mg',
    },
    {
      name: 'mapActions',
      abbr: 'ma',
    },
    {
      name: 'mapMutations',
      abbr: 'mm',
    },
  ];

  const importVuexHelpers = importVuex.split(',').map((item) => {
    let vuexHelper = '';

    const isFullName = vuexHelpers.some((helper) => helper.name === item);

    if (isFullName) {
      // 直接返回全名帮手方法
      vuexHelper = item;
    } else {
      // 返回缩写对应的全名帮手方法
      vuexHelper = vuexHelpers.filter((helper) => helper.abbr === item)[0].name;
    }

    return vuexHelper;
  });

  return importVuexHelpers;
};

/**
 * 获取 Vuex 导入声明
 */
const getVuexImportStatement = (api, options) => {
  const importVuexHelpers = getVuexImportHelpers(api, options).join(', ');

  return `import { ${importVuexHelpers} } from 'vuex';`;
};

/**
 * 导出
 */
module.exports = {
  getTargetComponentPath,
  getComponentImportStatement,
  getImportComponentPath,
  getVuexImportStatement,
  getVuexImportHelpers,
};
