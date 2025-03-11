import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_PATH,
  resolve: {
    alias: {
      '@/': '/src/',
      '@/pages': '/src/pages/',
      '@/components': '/src/components/',
      '@/utils': '/src/utils/',
      '@/hooks': '/src/hooks/',
      '@/stores': '/src/stores/',
    },
  },
  build: {
    outDir: 'docs'
  },
  plugins: [
    react(),
    {
      name: 'html-transform',
      transformIndexHtml(html) {
        return html.replace("‘/sw.js'", "'/map-monitor-pwa/sw.js'");
      }
    },
    {
      name: 'generate-sw',
      writeBundle(options, bundle) {
        // 基础缓存文件列表
        const baseUrlsToCache = [
          '/map-monitor-pwa/',
          '/map-monitor-pwa/index.html',
          '/map-monitor-pwa/manifest.json',
          '/map-monitor-pwa/assets/images/monitor-icon-red.svg',
          '/map-monitor-pwa/assets/audio/alert.mp3'
        ];

        // 添加构建后的资源文件到缓存列表
        const buildUrlsToCache = Object.keys(bundle)
          .filter(fileName => fileName.endsWith('.js') || fileName.endsWith('.css'))
          .map(fileName => `/map-monitor-pwa/${fileName}`);

        // 合并所有需要缓存的文件
        const urlsToCache = [...baseUrlsToCache, ...buildUrlsToCache];

        // 生成 sw.js 内容
        const swContent = `const CACHE_NAME = 'map-monitor-pwa-v1';
        const urlsToCache = ${JSON.stringify(urlsToCache, null, 2)};

        self.addEventListener('install', (event) => {
          event.waitUntil(
            caches.open(CACHE_NAME)
              .then((cache) => cache.addAll(urlsToCache))
          );
        });

        self.addEventListener('fetch', (event) => {
          event.respondWith(
            caches.match(event.request)
              .then((response) => {
                if (response) {
                  return response;
                }
                return fetch(event.request)
                  .then((response) => {
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                      return response;
                    }
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME)
                      .then((cache) => {
                        cache.put(event.request, responseToCache);
                      });
                    return response;
                  });
              })
          );
        });

        self.addEventListener('activate', (event) => {
          event.waitUntil(
            caches.keys().then((cacheNames) => {
              return Promise.all(
                cacheNames.map((cacheName) => {
                  if (cacheName !== CACHE_NAME) {
                    return caches.delete(cacheName);
                  }
                })
              );
            })
          );
        });`;

        // 写入 sw.js 到构建输出目录
        fs.writeFileSync(
          path.resolve(options.dir as any, 'sw.js'),
          swContent
        );
      }
    }
  ],
});
