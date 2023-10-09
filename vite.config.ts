import {ConfigEnv, loadEnv, UserConfig} from "vite";
import createVuePlugin from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import svgLoader from "vite-svg-loader";

import path from "path";

const CWD = process.cwd();

// https://vitejs.dev/config/
export default ({mode}: ConfigEnv): UserConfig => {
    const {VITE_BASE_URL} = loadEnv(mode, CWD);
    return {
        base: VITE_BASE_URL,
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src")
            }
        },

        css: {
            preprocessorOptions: {
                less: {
                    modifyVars: {
                        hack: `true; @import (reference) "${path.resolve("src/style/variables.less")}";`
                    },
                    math: "strict",
                    javascriptEnabled: true
                }
            }
        },

        plugins: [
            createVuePlugin(),
            vueJsx(),
            // viteMockServe({
            //   mockPath: 'mock',
            //   localEnabled: true,
            // }),
            svgLoader()
        ],

        build: {
            chunkSizeWarningLimit: 1000,
            rollupOptions: {
                output: {
                    manualChunks(id) {
                        if (id.includes('node_modules')) {
                            return id.toString().split('node_modules/')[1].split('/')[0].toString();
                        }
                    }
                }
            }
        },

        server: {
            port: 3005,
            host: "localhost",
            proxy: {
                "/smartReport": { /* 测试环境 */
                    target: "http://120.24.253.160:6700",
                    // 允许跨域
                    changeOrigin: true
                    // pathRewrite: { // 在发出请求后将 /patent 替换为''空值，这样不影响接口请求
                    //   '^/patent': ''
                    // }
                }
            }
        }
    };
};
