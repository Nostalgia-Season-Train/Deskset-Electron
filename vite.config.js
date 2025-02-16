import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import path from 'path'

export default defineConfig({
  base: './',
  build: {
    outDir: path.resolve(__dirname, './dist'),
    emptyOutDir: true,
    rollupOptions: {
      // 多页应用打包可能有些问题
      input: {
        desktop: path.resolve(__dirname, 'desktop.html'),
        manager: path.resolve(__dirname, 'manager.html')
      }
    },
    target: 'es2022'  // 支持顶级 await 的环境，否则 const server = await window.electron.server() 会报错
  },
  plugins: [
    vue(),
    AutoImport({resolvers: [ElementPlusResolver()]}),
    Components({
      dirs: ['src/components'],
      extensions: ['vue'],
      resolvers: [ElementPlusResolver()]
    })
  ],
  server: {
    host: '127.0.0.1',
    port: 5173
  }
})
