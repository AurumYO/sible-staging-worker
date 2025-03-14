export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      let key = url.pathname.substring(1); // e.g., "media/user_12/tts_..."
      
      // Remove "media/" prefix if present
      if (key.startsWith("media/")) {
        key = key.substring(6);  // Remove "media/"
      }
      
      // Attempt to fetch the object from R2
      const object = await env.MY_R2_BUCKET.get(key);
      if (!object) {
        return new Response("Not found", { status: 404 });
      }
      
      const headers = new Headers(object.httpMetadata?.custom || {});
      headers.delete("Content-Encoding");
      
      return new Response(object.body, {
        status: 200,
        headers: headers
      });
    } catch (err) {
      // Return a simple error response for debugging purposes
      return new Response("Worker error: " + err.toString(), { status: 500 });
    }
  }
}