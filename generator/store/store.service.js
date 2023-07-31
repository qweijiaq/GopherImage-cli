const { camelCase, capitalize } = require('lodash');
const path = require('path');

const {
  getGeneratedFileImportPath,
  pascalCase,
} = require('../app/app.service');

/**
 * 获取 Store 模板文件路径
 */
const getStoreTemplatePath = (options) => {
  const { action, resource } = options;

  let templateFile = 'store.ejs';

  if (action) {
    templateFile = 'store-action.ejs';
  }

  if (resource) {
    templateFile = 'store-action-resource.ejs';
  }

  return path.join('.', 'templates', templateFile);
};

/**
 * 获取 Store 数据类型名
 */
const getStoreStateName = (options) => {
  const { store: storeName } = options;
  return pascalCase(storeName) + 'StoreState';
};

/**
 * 获取 Store 模块名
 */
const getStoreModuleName = (options) => {
  const { store: storeName } = options;
  return camelCase(storeName) + 'StoreModule';
};

/**
 * 获取 Store 导入声明
 */
const getStoreImportStatement = (options) => {
  const storeStateName = getStoreStateName(options);
  const storeModuleName = getStoreModuleName(options);
  const storeImportPath = getGeneratedFileImportPath('store', options);

  return `import { ${storeStateName}, ${storeModuleName} } from '${storeImportPath}';`;
};

/**
 * 获取 Store 选项
 */
const getStoreOptions = (options) => {
  let {
    // 动作名
    action = 'action',
    // 请求方法
    method = 'get',
    // 接口地址
    api = 'resources',
    // 请求的资源
    resource = 'resource',
    // 资源类型
    resourceTypeName = pascalCase(resource),
    // 动作参数
    actionParam = 'options',
    // 动作参数类型
    actionParamType = pascalCase(action) + 'Options',
    // 动作预处理
    pre = false,
    // 动作后处理
    post = false,
  } = options;

  // comments:Array:CommentListItem
  const resourceArray = resource.split(':');
  const [resourceName, resourceType, resourceItemType] = resourceArray;

  if (resourceArray.length > 1) {
    resourceTypeName = pascalCase(resourceName);
  }

  return {
    ...options,
    action,
    method,
    api,
    resource,
    resourceName,
    resourceNameCapitalize: capitalize(resourceName),
    resourceType,
    resourceTypeName,
    resourceItemType,
    actionParam,
    actionParamType,
    pre,
    post,
  };
};

/**
 * 获取目标 Store 模块路径
 */
const getTargetStorePath = (api, options) => {
  return Object.keys(api.generator.files).filter((file) =>
    file.includes(`${options.to}.store.ts`),
  )[0];
};

/**
 * 导出
 */
module.exports = {
  getStoreTemplatePath,
  getStoreStateName,
  getStoreModuleName,
  getStoreImportStatement,
  getStoreOptions,
  getTargetStorePath,
};
