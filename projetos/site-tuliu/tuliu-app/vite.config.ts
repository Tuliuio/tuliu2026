import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'serve-static-html',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const pathname = (req.url || '').split('?')[0]

          // Serve static HTML files from propostas and mira directories
          if (pathname.startsWith('/propostas/') || pathname.startsWith('/mira/')) {
            let filePath = path.join(process.cwd(), 'public', pathname)

            // If it's a directory, look for index.html
            if (!filePath.endsWith('.html')) {
              filePath = path.join(filePath, 'index.html')
            }

            if (fs.existsSync(filePath)) {
              const html = fs.readFileSync(filePath, 'utf-8')
              res.setHeader('Content-Type', 'text/html; charset=utf-8')
              res.setHeader('Cache-Control', 'no-cache')
              return res.end(html)
            }
          }

          next()
        })
      }
    }
  ],
  build: {
    outDir: 'dist',
  }
})
