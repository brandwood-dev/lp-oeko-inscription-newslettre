/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Allow this site to be embedded in iframes.
          { key: "Content-Security-Policy", value: "frame-ancestors *" },
          // Not universally respected, but helps override default behavior.
          { key: "X-Frame-Options", value: "ALLOWALL" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
