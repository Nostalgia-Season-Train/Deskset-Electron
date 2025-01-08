import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import path from 'path'

export default defineConfig({
  base: './',
  build: {
    outDir: path.resolve(__dirname, '../dist'),
    rollupOptions: {
      // 多页应用打包可能有些问题
      input: {
        desktop: path.resolve(__dirname, 'index.html'),
        manager: path.resolve(__dirname, 'manager.html')
      }
    }
  },
  plugins: [
    vue(),
    AutoImport({resolvers: [ElementPlusResolver()]}),
    Components({
      dirs: ['src/components'],
      extensions: ['vue'],
      resolvers: [ElementPlusResolver()]
    })
  ]
})
