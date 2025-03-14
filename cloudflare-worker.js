export async function handleRequest(request, env) {
  const url = new URL(request.url)
  // Remove the leading slash to form the key.
  const key = url.pathname.substring(1)
  
  // Fetch the object from R2 directly.
  const object = await env.MY_R2_BUCKET.get(key)
  if (!object) {
    return new Response("Not found", { status: 404 })
  }
  
  // Optionally, copy any headers from R2 metadata.
  const headers = new Headers(object.httpMetadata?.custom || {})
  // Remove the unwanted content-encoding header.
  headers.delete("Content-Encoding")
  
  return new Response(object.body, {
    status: 200,
    headers: headers
  })
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request, env))
})
