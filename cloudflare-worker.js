export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      let key = url.pathname.substring(1); // e.g., "media/user_12/tts_..."
      
      // Remove "media/" prefix if present.
      if (key.startsWith("media/")) {
        key = key.substring(6);  // Remove "media/"
      }
      
      // Fetch the object from R2 using your binding.
      const object = await env.MY_R2_BUCKET.get(key);
      if (!object) {
        return new Response("Not found", { status: 404 });
      }
      
      // Manually build a new Headers object.
      const headers = new Headers();
      // Set Content-Type based on metadata, if available.
      if (object.httpMetadata?.contentType) {
        headers.set("Content-Type", object.httpMetadata.contentType);
      } else {
        headers.set("Content-Type", "application/octet-stream");
      }
      
      // Do NOT set the Content-Encoding header (or explicitly set it to identity if desired).
      // headers.set("Content-Encoding", "identity"); // Optional
      
      return new Response(object.body, {
        status: 200,
        headers: headers
      });
    } catch (err) {
      return new Response("Worker error: " + err.toString(), { status: 500 });
    }
  }
}
