const {
  getTargetComponentPath,
  getComponentImportStatement,
  getImportComponentPath,
  getVuexImportStatement,
} = require('./import.service');

/**
 * 导入生成器
 */
const importGenerator = (api, options) => {
  // 解构命令选项
  const { importComponent, importVuex } = options;

  // 导入组件
  if (importComponent) {
    // 导入组件的路径
    const importComponentPath = getImportComponentPath(api, options);

    // 导入声明
    const componentImportStatement =
      getComponentImportStatement(importComponentPath);

    // 目标组件路径
    const targetComponentPath = getTargetComponentPath(api, options);

    // 插入导入声明
    api.injectImports(targetComponentPath, componentImportStatement);
  }

  // 导入 Vuex
  if (importVuex) {
    // 目标组件路径
    const targetComponentPath = getTargetComponentPath(api, options);

    // Vuex 导入声明
    const vuexImportStatement = getVuexImportStatement(api, options);

    // 插入导入声明
    api.injectImports(targetComponentPath, vuexImportStatement);
  }
};

/**
 * 导出
 */
module.exports = importGenerator;
