

const server = Bun.serve({
  routes: {
    '/api/status': new Response('OK'),
  }
})
