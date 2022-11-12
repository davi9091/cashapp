

export const getHeaders = (body?: Record<string, unknown>, method = 'POST'): RequestInit => ({
  method,
  credentials: 'include',
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache, no-store, must-revalidate' },
  body: body && JSON.stringify(body),
})
