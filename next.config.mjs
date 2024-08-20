// next.config.mjs

export default {
    productionBrowserSourceMaps: false,  // ปิดการสร้าง source maps ใน production
    webpack(config) {
      // ปิดการสร้าง source maps ในระหว่างการพัฒนา
      config.devtool = false;
      return config;
    },
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'http://iottechgroup.dyndns.biz:18180/api/:path*', // Proxy API
        },
      ];
    },
  };
  