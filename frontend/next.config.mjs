/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
      ignoreBuildErrors: true,
    },
    webpack: async (config, { isServer }) => {
      const CaseSensitivePathsPlugin = await import('case-sensitive-paths-webpack-plugin');
  
      config.plugins.push(new CaseSensitivePathsPlugin.default());
  
      return config;
    },
  };
  
  export default nextConfig;
  