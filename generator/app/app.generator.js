/**
 * 应用生成器
 */
const appGenerator = (api, options) => {
  // 在项目的 package.json 里添加命令
  api.extendPackage({
    scripts: {
      'generate:component': 'vue invoke vue-cli-plugin-goimg --component',
      'generate:store': 'vue invoke vue-cli-plugin-goimg --store',
      'generate:store:state': 'vue invoke vue-cli-plugin-goimg --storeState',
      'import:component': 'vue invoke vue-cli-plugin-goimg --importComponent',
      'import:vuex': 'vue invoke vue-cli-plugin-goimg --importVuex',
      gc: 'vue invoke vue-cli-plugin-goimg --component',
      gs: 'vue invoke vue-cli-plugin-goimg --store',
      gss: 'vue invoke vue-cli-plugin-goimg --storeState',
      ic: 'vue invoke vue-cli-plugin-goimg --importComponent',
      iv: 'vue invoke vue-cli-plugin-goimg --importVuex',
    },
  });
};

module.exports = appGenerator;
