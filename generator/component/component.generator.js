const {
  getGeneratedFilePath,
  getParentFilePath,
} = require('../app/app.service');

const {
  getTemplatePath,
  getComponentName,
  getComponentImportStatement,
  getComponentOptions,
} = require('./component.service');

/**
 * 组件生成器
 */
const componentGenerator = (api, options) => {
  // 如果命令里没提供 component 选项，直接返回，啥也不做
  if (!options.component) return;

  // 组件的存放位置
  const generatedComponentPath = getGeneratedFilePath('component', options);

  // 组件样式表的存放位置
  const generatedStylePath = getGeneratedFilePath('style', options);

  // 模板路径
  const { componentTemplatePath, styleTemplatePath } = getTemplatePath();

  // 组件名
  const { componentName, componentNamePascalCase } = getComponentName(options);

  // 准备选项
  options = getComponentOptions(options);

  // 在项目里生成组件与样式文件
  api.render(
    {
      [generatedComponentPath]: componentTemplatePath,
      [generatedStylePath]: styleTemplatePath,
    },
    {
      componentName,
      componentNamePascalCase,
      ...options,
    },
  );

  // 在父组件里导入新生成的组件
  if (options.parent) {
    const componentImportStatement = getComponentImportStatement(options);
    const parentComponentPath = getParentFilePath('component', api, options);

    api.injectImports(parentComponentPath, componentImportStatement);
  }
};

/**
 * 导出
 */
module.exports = componentGenerator;
