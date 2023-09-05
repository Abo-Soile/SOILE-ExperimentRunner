import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "url";
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      {
        find: "@/",
        replacement: fileURLToPath(new URL("./src/", import.meta.url)),
      },
    ],
  },
  plugins: [vue()],
  server: {
    proxy: {
      "^/exp/.*/.*/.+": {
        target: "https://localhost:8081",
        rewrite: (path) => path.replace(/^\/exp/, "/run"),
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            console.log("proxy error", err);
          });
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            console.log(
              "Sending Request:",
              req.method,
              req.url,
              " => TO THE TARGET =>  ",
              proxyReq.method,
              proxyReq.protocol,
              proxyReq.host,
              proxyReq.path,
              JSON.stringify(proxyReq.getHeaders())
            );
          });
          proxy.on("proxyRes", (proxyRes, req, _res) => {
            console.log(
              "Received Response from the Target:",
              proxyRes.statusCode,
              req.url,
              JSON.stringify(proxyRes.headers)
            );
          });
        },
        secure: false,
      },
      "^/api/.*": {
        target: "https://localhost:8081",
        rewrite: (path) => path.replace(/^\/api/, ""),
        secure: false,
      },
      "^/pilot/.*/.*/.+": {
        target: "https://localhost:8081",
        rewrite: (path) =>
          path.replace(/^\/pilot(\/\w+\/\w+)(\/.*)$/, "/task$1/execute$2"),
        secure: false,
      },
      "^/editing/.*/.*/.+": {
        target: "https://localhost:8081",
        rewrite: (path) =>
          path.replace(/^\/editing(\/\w+\/\w+)(\/.*)$/, "/task$1/execute$2"),
        secure: false,
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            console.log("proxy error", err);
          });
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            console.log(
              "Sending Request:",
              req.method,
              req.url,
              " => TO THE TARGET =>  ",
              proxyReq.method,
              proxyReq.protocol,
              proxyReq.host,
              proxyReq.path,
              JSON.stringify(proxyReq.getHeaders())
            );
          });
          proxy.on("proxyRes", (proxyRes, req, _res) => {
            console.log(
              "Received Response from the Target:",
              proxyRes.statusCode,
              req.url,
              JSON.stringify(proxyRes.headers)
            );
          });
        },
      },
    },
  },
});
