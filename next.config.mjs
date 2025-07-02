/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Completely disable Node.js modules for client-side
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
        util: false,
        buffer: false,
        events: false,
        querystring: false,
        punycode: false,
        child_process: false,
        worker_threads: false,
        cluster: false,
        dgram: false,
        dns: false,
        module: false,
        repl: false,
        readline: false,
        vm: false,
        constants: false,
      }
      
      // Ignore problematic modules
      config.externals = config.externals || []
      config.externals.push({
        'utf-8-validate': 'commonjs utf-8-validate',
        'bufferutil': 'commonjs bufferutil',
        '@nodelib/fs.scandir': 'commonjs @nodelib/fs.scandir',
        '@nodelib/fs.stat': 'commonjs @nodelib/fs.stat',
        '@nodelib/fs.walk': 'commonjs @nodelib/fs.walk',
      })
    }
    
    return config
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    esmExternals: 'loose',
  },
}

export default nextConfig
