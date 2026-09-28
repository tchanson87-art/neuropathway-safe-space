/** @type {import('next').NextConfig} */
const nextConfig = {
  // The Supabase integration provides SUPABASE_URL / SUPABASE_ANON_KEY; expose them
  // under the NEXT_PUBLIC_ names the browser, server, and proxy clients read.
  env: {
    NEXT_PUBLIC_SUPABASE_URL:
      process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
