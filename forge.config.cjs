const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
  packagerConfig: {
    asar: true,
    ignore: [
      // === 打包时要忽略的路径 ===
      // 代码
      '/src-components',
      '/src-desktop',
      '/src-manager',
      '/module-bin',
      // 静态资源
      '/static/fonts',  // vite 编译时已经打包字体到 dist 中，不用重复引入
      // 外部文件（包括后端生成或需要的文件）
      '/config', '/log',                 // 配置、日志
      '/api', '/components', '/themes',  // 接口、组件、主题
      '/i18n',                           // 翻译
      // 后端及其依赖
      '/runtime',
      '/site-packages',
      'Deskset-Back.exe',
      'Deskset-Back.py',
      // 临时文件
      '/tmp'
    ]
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel'
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
