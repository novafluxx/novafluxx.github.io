export default {
  async fetch(request, env) {
    // Serve static assets via ASSETS binding
    // Provides foundation for future serverless functions
    return env.ASSETS.fetch(request);
  },
};
