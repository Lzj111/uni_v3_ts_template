import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
// import Unocss from 'unocss/vite';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
    // Unocss(),  
  ],
  // > 服务器配置
  server: {
    hmr: {
      overlay: false
    },
    port: 8888
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '*': path.resolve(''),
    },
  },
});
