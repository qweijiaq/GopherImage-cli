const fs = require('fs');
const { EOL } = require('os');

const {
  getParentFilePath,
  getProjectFileContent,
  insertFileContent,
  getParentName,
  findReplaceFileContent,
  findFileContent,
} = require('../app/app.service');

const { getComponentName } = require('./component.service');

/**
 * 组件生成器钩子
 */
const componentGeneratorHook = (api, options) => {
  api.afterInvoke(() => {
    if (!options.component || !options.parent) return;

    // 父组件路径
    const parentComponentPath = getParentFilePath('component', api, options);

    // 父组件文件内容
    let parentFileContent = getProjectFileContent(parentComponentPath, api);

    targetComponentFileContent = findReplaceFileContent({
      fileContent: parentFileContent,
      find: `components: {}`,
      replace: [`  components: {`, `  },`],
    });

    // 查找内容
    const findComponentsOptions = 'components: {';
    const { componentNamePascalCase } = getComponentName(options);

    // 插入内容
    const insertComponentsOptionsContent = `    ${componentNamePascalCase},`;

    const findRegisterComponentResult = findFileContent({
      fileContent: parentFileContent,
      find: `${componentNamePascalCase},`,
    });

    if (!findRegisterComponentResult) {
      // 在父组件插入内容
      parentFileContent = insertFileContent({
        fileContent: parentFileContent,
        find: findComponentsOptions,
        insert: insertComponentsOptionsContent,
      });
    }

    // 父组件名字
    const parentComponentName = getParentName(options);

    // 查找内容
    const findWrapperElement = `<div class="${parentComponentName}">`;

    // 插入内容
    const insertWrapperElementContent = `    <${componentNamePascalCase} />`;

    const findUseComponentResult = findFileContent({
      fileContent: parentFileContent,
      find: `<${componentNamePascalCase}`,
    });

    if (!findUseComponentResult) {
      // 在父组件插入内容
      parentFileContent = insertFileContent({
        fileContent: parentFileContent,
        find: findWrapperElement,
        insert: insertWrapperElementContent,
      });
    }

    // 写入父组件文件
    fs.writeFileSync(
      api.resolve(parentComponentPath),
      parentFileContent.join(EOL),
      {
        encoding: 'utf-8',
      },
    );
  });
};

/**
 * 导出
 */
module.exports = componentGeneratorHook;
