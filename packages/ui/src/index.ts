import { serve } from "bun"
import index from "./index.html"

const API_BASE = process.env.API_URL ?? "http://localhost:3000"

const proxy =
  (target: string) =>
  async (req: Request): Promise<Response> => {
    const hasBody = req.method !== "GET" && req.method !== "HEAD"
    return fetch(target, {
      method: req.method,
      headers: req.headers,
      body: hasBody ? await req.text() : undefined,
    })
  }

const server = serve({
  port: parseInt(process.env.PORT ?? "3001"),
  routes: {
    "/api/auth/register": { POST: proxy(`${API_BASE}/api/auth/register`) },
    "/api/auth/login": { POST: proxy(`${API_BASE}/api/auth/login`) },
    "/api/auth/logout": { POST: proxy(`${API_BASE}/api/auth/logout`) },
    "/api/auth/whoami": { GET: proxy(`${API_BASE}/api/auth/whoami`) },

    "/*": index,
  },

  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
})

console.log(`Server running at ${server.url}`)
