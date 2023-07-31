const {
  getStoreTemplatePath,
  getStoreStateName,
  getStoreModuleName,
  getStoreImportStatement,
  getStoreOptions,
} = require('./store.service');

const {
  getGeneratedFilePath,
  getParentFilePath,
} = require('../app/app.service');

/**
 * Store 生成器
 */
const storeGenerator = (api, options) => {
  if (!options.store) return;

  // Store 模板文件路径
  const storeTemplatePath = getStoreTemplatePath(options);

  // Store 数据类型
  const storeStateName = getStoreStateName(options);

  // Store 模块名
  const storeModuleName = getStoreModuleName(options);

  // Store 存放位置
  const generatedStorePath = getGeneratedFilePath('store', options);

  // Store 选项
  options = getStoreOptions(options);

  // 在项目里生成 Store 模块文件
  api.render(
    {
      [generatedStorePath]: storeTemplatePath,
    },
    {
      storeStateName,
      storeModuleName,
      ...options,
    },
  );

  // 在父 Store 模块里导入新生成的 Store 模块
  if (options.parent) {
    const parentStorePath = getParentFilePath('store', api, options);
    const storeImportStatement = getStoreImportStatement(options);

    api.injectImports(parentStorePath, storeImportStatement);
  }
};

/**
 * 导出
 */
module.exports = storeGenerator;
