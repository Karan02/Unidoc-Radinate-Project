const nextConfig = { 
  reactStrictMode: true,
  output: 'export', // ✅ Enables static HTML export for App Router
  images: {
    unoptimized: true, // optional: disables Image Optimization (since S3 is static)
  },
  trailingSlash: true, // optional: makes URLs S3-friendly (/about/index.html)
}
module.exports = nextConfig;
