// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     host: '0.0.0.0',
//     port: 5173,
//     proxy: {
//       '/api': {
//         target: 'http://localhost:3000',
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//   },
// });


import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    __BASE_URL__: JSON.stringify('http://localhost:5173/'),
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://yuktiverse.onrender.com/',
        changeOrigin: true,
        secure: false,
      },
      '/years': {
        // target: 'http://localhost:3000', 
        target: 'https://yuktiverse.onrender.com/', 
        changeOrigin: true,
        secure: false,
      },
       '/ai-help': 'https://yuktiverse.onrender.com/',
    },
  },
});


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
//         target: process.env.VITE_BACKEND_URL,
//         changeOrigin: true,
//         secure: false,
//       },
//       '/years': {
//         target:process.env.VITE_BACKEND_URL, 
//         changeOrigin: true,
//         secure: false,
//       },
//        '/ai-help':process.env.VITE_BACKEND_URL,
//     },
//   },
// });


// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig(({ mode }) => ({
//   plugins: [react()],
//   server: {
//     host: '0.0.0.0',
//     port: 5173,
//     proxy: mode === 'development' ? {
//       '/api': {
//         target: process.env.VITE_BACKEND_URL,
//         changeOrigin: true,
//         secure: false,
//       },
//       '/years': {
//         target: process.env.VITE_BACKEND_URL,
//         changeOrigin: true,
//         secure: false,
//       },
//       '/ai-help': {
//         target: process.env.VITE_BACKEND_URL,
//         changeOrigin: true,
//         secure: false,
//       },
//     } : undefined
//   },
// }));
