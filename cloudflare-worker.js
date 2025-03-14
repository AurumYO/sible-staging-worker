export default {
  async fetch(request, env, ctx) {
    try {
      // Debug: check available bindings
      const availableBindings = Object.keys(env);
      console.log("Available bindings:", availableBindings);
      
      const url = new URL(request.url);
      let key = url.pathname.substring(1);
      if (key.startsWith("media/")) {
        key = key.substring(6);
      }
      if (!env.MY_R2_BUCKET) {
        return new Response("R2 binding not available: " + availableBindings.join(", "), { status: 500 });
      }
      const object = await env.MY_R2_BUCKET.get(key);
      if (!object) {
        return new Response("Not found", { status: 404 });
      }
      const headers = new Headers();
      if (object.httpMetadata?.contentType) {
        headers.set("Content-Type", object.httpMetadata.contentType);
      }
      // Do not include Content-Encoding
      return new Response(object.body, { status: 200, headers });
    } catch (err) {
      return new Response("Worker error: " + err.toString(), { status: 500 });
    }
  }
}