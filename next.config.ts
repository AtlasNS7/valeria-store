import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        // Aceita imagens de qualquer projeto Supabase (*.supabase.co).
        // Se preferir travar num projeto só, troque "**" pelo id do seu
        // projeto, ex: "abcxyz123.supabase.co".
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
