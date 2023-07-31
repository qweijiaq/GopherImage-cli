const fs = require('fs');
const { EOL } = require('os');
const { pascalCase } = require('../app/app.service');

const {
  getTargetComponentPath,
  getVuexImportHelpers,
} = require('./import.service');

const {
  getProjectFileContent,
  insertFileContent,
  findFileContent,
  replaceFileContent,
  findReplaceFileContent,
} = require('../app/app.service');

/**
 * 导入生成器钩子
 */
const importGeneratorHook = (api, options) => {
  api.afterInvoke(() => {
    const { importComponent, importVuex } = options;

    if (importComponent) {
      componentImportGeneratorHook(api, options);
    }

    if (importVuex) {
      vuexImportGeneratorHook(api, options);
    }
  });
};

/**
 * 组件导入生成器钩子
 */
const componentImportGeneratorHook = (api, options) => {
  // 解构命令选项
  const { importComponent, to: targetComponent } = options;

  // 目标组件
  const targetComponentPath = getTargetComponentPath(api, options);

  let targetComponentFileContent = getProjectFileContent(
    targetComponentPath,
    api,
  );

  // 注册组件
  const registerComponent =
    importComponent
      .split(',')
      .map((item) => pascalCase(item))
      .join(`,${EOL}    `) + ',';

  const findRegisterComponent = findFileContent({
    fileContent: targetComponentFileContent,
    find: `${registerComponent}`,
  });

  if (!findRegisterComponent) {
    targetComponentFileContent = findReplaceFileContent({
      fileContent: targetComponentFileContent,
      find: `components: {}`,
      replace: [`  components: {`, `  },`],
    });

    targetComponentFileContent = insertFileContent({
      fileContent: targetComponentFileContent,
      find: 'components: {',
      insert: `    ${registerComponent}`,
    });
  }

  // 使用组件
  const useComponent = importComponent
    .split(',')
    .map((item) => `<${pascalCase(item)} />`)
    .join(`${EOL}    `);

  const findUseComponent = findFileContent({
    fileContent: targetComponentFileContent,
    find: `${useComponent}`,
  });

  if (!findUseComponent) {
    targetComponentFileContent = insertFileContent({
      fileContent: targetComponentFileContent,
      find: `<div class="${targetComponent}">`,
      insert: `    ${useComponent}`,
    });
  }

  // 写入目标组件文件
  fs.writeFileSync(
    api.resolve(targetComponentPath),
    targetComponentFileContent.join(EOL),
    {
      encoding: 'utf-8',
    },
  );
};

/**
 * Vuex 导入生成器钩子
 */
const vuexImportGeneratorHook = (api, options) => {
  // 解构命令选项
  const { importComponent, to: targetComponent } = options;

  // 目标组件
  const targetComponentPath = getTargetComponentPath(api, options);

  // 导入帮手方法
  const importVuexHelpers = getVuexImportHelpers(api, options);

  // 目录组件文件内容
  let targetComponentFileContent = getProjectFileContent(
    targetComponentPath,
    api,
  );

  // 插入内容
  importVuexHelpers.map((helper) => {
    let find = '';
    let insert = `    ...${helper}({}),`;

    const findResult = findFileContent({
      fileContent: targetComponentFileContent,
      find: `\\.\\.\\.${helper}`,
    });

    // 如果找到要插入的内容，就什么也不做
    if (findResult) return;

    if (helper === 'mapState' || helper === 'mapGetters') {
      // 查找替换
      targetComponentFileContent = findReplaceFileContent({
        fileContent: targetComponentFileContent,
        find: `computed: {}`,
        replace: [`  computed: {`, `  },`],
      });

      find = `computed: {`;
    }

    if (helper === 'mapMutations' || helper === 'mapActions') {
      // 查找替换
      targetComponentFileContent = findReplaceFileContent({
        fileContent: targetComponentFileContent,
        find: `methods: {}`,
        replace: [`  methods: {`, `  },`],
      });

      find = `methods: {`;
    }

    // 插入内容
    targetComponentFileContent = insertFileContent({
      fileContent: targetComponentFileContent,
      find,
      insert,
    });
  });

  // 写入目标组件文件
  fs.writeFileSync(
    api.resolve(targetComponentPath),
    targetComponentFileContent.join(EOL),
    {
      encoding: 'utf-8',
    },
  );
};

/**
 * 导出
 */
module.exports = importGeneratorHook;
