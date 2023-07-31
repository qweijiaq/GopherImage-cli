const fs = require('fs');
const { EOL } = require('os');

const {
  getParentFilePath,
  getProjectFileContent,
  insertFileContent,
  pascalCase,
} = require('../app/app.service');

const {
  getStoreStateName,
  getStoreModuleName,
  getTargetStorePath,
} = require('./store.service');

/**
 * Store 生成器钩子
 */
const storeGeneratorHook = (api, options) => {
  api.afterInvoke(() => {
    const { store, parent, module, storeState, to } = options;

    // Store 模块生成器钩子
    if (store && parent && module) {
      storeModuleGeneratorHook(api, options);
    }

    // Store State 生成器钩子
    if (storeState && to) {
      storeStateGeneratorHook(api, options);
    }
  });
};

/**
 * Store 模块生成器钩子
 */
const storeModuleGeneratorHook = (api, options) => {
  const { module: moduleName, parent: parentStore } = options;

  // Store 数据类型
  const storeStateName = getStoreStateName(options);

  // Store 模块名
  const storeModuleName = getStoreModuleName(options);

  // 父 Store 路径
  const parentStorePath = getParentFilePath('store', api, options);

  // 父 Store 文件内容
  let parentFileContent = getProjectFileContent(parentStorePath, api);

  // 查找父 Store 文件
  let findParentStoreState;

  if (parentStore === 'app/app') {
    findParentStoreState = 'export interface RootState';
  } else {
    findParentStoreState = 'export interface .+StoreState';
  }

  // 在父 Store 类型里插入模块
  parentFileContent = insertFileContent({
    fileContent: parentFileContent,
    find: findParentStoreState,
    insert: `  ${moduleName}: ${storeStateName},`,
  });

  // 在父 Store 模块里注册模块
  parentFileContent = insertFileContent({
    fileContent: parentFileContent,
    find: 'modules: {',
    insert: `    ${moduleName}: ${storeModuleName},`,
  });

  // 写入父 Store 模块文件
  fs.writeFileSync(api.resolve(parentStorePath), parentFileContent.join(EOL), {
    encoding: 'utf-8',
  });
};

/**
 * Store State 生成器钩子
 */
const storeStateGeneratorHook = (api, options) => {
  const { storeState, to: storeModule } = options;

  // State 名字与类型
  let stateName, stateType, stateDefault;

  const storeStateArray = storeState.split(':');

  if (storeStateArray.length > 1) {
    stateName = storeStateArray[0];
    stateType = storeStateArray[1];
    stateDefault = storeStateArray[2];
  } else {
    stateName = storeState;
    stateType = 'string';
    stateDefault = `''`;
  }

  // Store 模块文件
  const storeModulePath = getTargetStorePath(api, options);
  let storeModuleContent = getProjectFileContent(storeModulePath, api);

  // 查找插入
  const findInsert = [
    {
      // Type
      find: `export interface ${pascalCase(storeModule) + 'StoreState'}`,
      insert: `  ${stateName}: ${stateType},`,
    },
    {
      // State
      find: `state: {`,
      insert: `    ${stateName}: ${stateDefault},`,
    },
    {
      // Getters
      find: `getters: {`,
      insert: `    ${stateName}(state) {${EOL}      return state.${stateName};${EOL}    },${EOL}`,
    },
    {
      // Mutations
      find: `mutations: {`,
      insert: `    set${pascalCase(
        stateName,
      )}(state, data) {${EOL}      state.${stateName} = data;${EOL}    },${EOL}`,
    },
  ];

  findInsert.map((item) => {
    storeModuleContent = insertFileContent({
      fileContent: storeModuleContent,
      find: item.find,
      insert: item.insert,
    });
  });

  // 写入 Store 模块文件
  fs.writeFileSync(api.resolve(storeModulePath), storeModuleContent.join(EOL), {
    encoding: 'utf-8',
  });
};

/**
 * 导出
 */
module.exports = storeGeneratorHook;
