// 桌面页面 pageDesktop 在桌面窗口 winDesktop 上显示
const pageDesktop = new BroadcastChannel('pageDesktop')
const winDesktop = window.winDesktop


const desktop = {
  /* 组件 */
  switchWidget: async (widgetId, isDisplay) => pageDesktop.postMessage({
    'action': 'switchDisplay',
    'id': widgetId,
    'isDisplay': isDisplay
  }),

  /* 主题 */
  saveTheme: async (themeName) => pageDesktop.postMessage({
    'action': 'saveTheme',
    'themeName': themeName
  }),
  useTheme: async (themeName) => pageDesktop.postMessage({
    'action': 'useTheme',
    'themeName': themeName
  }),

  /* 开发 */
  refresh: async () => pageDesktop.postMessage({ 'action': 'refreshPage' }),
  openDevTool: async () => winDesktop.openDevTool()
}


export default desktop
