// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     host: '0.0.0.0',
//     port: 5173,
//     // proxy: {
//     //   '/api': {
//     //     target: 'http://localhost:3000',
//     //     changeOrigin: true,
//     //     secure: false,
//     //   },
//     // },
//   },
// });


// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
//   define: {
//     __BASE_URL__: JSON.stringify('http://localhost:5173/'),
//   },
//   server: {
//     host: '0.0.0.0',
//     port: 5173,
//     proxy: {
//       '/api': {
//         target: 'https://localhost:3000',
//         changeOrigin: true,
//         secure: false,
//       },
//       '/years': {
//         target: 'https://localhost:3000', 
//         changeOrigin: true,
//         secure: false,
//       },
//        '/ai-help': 'https://localhost:3000',
//     },
//   },
// });


import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      __BASE_URL__: JSON.stringify('http://localhost:5173/'),
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
      proxy: {
        '/api': {
          target:  env.VITE_BACKEND_URL,
          changeOrigin: true,
          secure: false,
        },
        '/years': {
          target: env.VITE_BACKEND_URL, // pulled from .env
          changeOrigin: true,
          secure: false,
        },
        '/ai-help': {
          target: env.VITE_BACKEND_URL,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
