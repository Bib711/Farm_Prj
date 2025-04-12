import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ['www.gettyimages.in','www.seedsnow.com','i.pinimg.com','thegrownetwork.com','images.freeimages.com','images.freeimages.com','cdn.pixabay.com','img.youtube.com','i.ytimg.com'], // Add the external image domain here
  },
};

export default nextConfig;
