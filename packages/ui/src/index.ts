import { serve } from "bun"
import index from "./index.html"

const API_BASE = process.env.API_URL ?? "http://localhost:3000"

const proxy =
  (target: string) =>
  async (req: Request): Promise<Response> => {
    const search = new URL(req.url).search
    const hasBody = req.method !== "GET" && req.method !== "HEAD"
    return fetch(search ? `${target}${search}` : target, {
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
    "/api/groups": {
      GET: proxy(`${API_BASE}/api/groups`),
      POST: proxy(`${API_BASE}/api/groups`),
    },
    "/api/groups/members": { GET: proxy(`${API_BASE}/api/groups/members`) },
    "/api/accounts": { GET: proxy(`${API_BASE}/api/accounts`), POST: proxy(`${API_BASE}/api/accounts`) },
    "/api/transactions": {
      GET: proxy(`${API_BASE}/api/transactions`),
      POST: proxy(`${API_BASE}/api/transactions`),
    },
    "/api/splits/outstanding": { GET: proxy(`${API_BASE}/api/splits/outstanding`) },
    "/api/splits/settle": { POST: proxy(`${API_BASE}/api/splits/settle`) },

    "/*": index,
  },

  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
})

console.log(`Server running at ${server.url}`)
