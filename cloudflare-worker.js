export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    let key = url.pathname.substring(1); // e.g., "media/user_12/tts_..."
    
    // Remove "media/" prefix if present
    if (key.startsWith("media/")) {
      key = key.substring(6);  // Remove the first 6 characters ("media/")
    }
    
    // Fetch the object from R2 using your binding
    const object = await env.MY_R2_BUCKET.get(key);
    if (!object) {
      return new Response("Not found", { status: 404 });
    }
    
    // Create headers from any custom metadata and remove the unwanted header.
    const headers = new Headers(object.httpMetadata?.custom || {});
    headers.delete("Content-Encoding");
    
    return new Response(object.body, {
      status: 200,
      headers: headers
    });
  }
}
