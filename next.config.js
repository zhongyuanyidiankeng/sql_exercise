// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // sql.js 需要禁用服务端 WebAssembly 限制
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }
    // 支持 .wasm 文件
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    return config;
  },
};

module.exports = nextConfig;
