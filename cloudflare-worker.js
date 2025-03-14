export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    // Remove the leading slash to form the key
    const key = url.pathname.substring(1);
    
    // Fetch the object from R2 using your binding
    const object = await env.MY_R2_BUCKET.get(key);
    if (!object) {
      return new Response("Not found", { status: 404 });
    }
    
    // Get any custom headers and remove the unwanted header
    const headers = new Headers(object.httpMetadata?.custom || {});
    headers.delete("Content-Encoding");
    
    return new Response(object.body, {
      status: 200,
      headers: headers
    });
  }
}
