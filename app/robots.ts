import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots { return { rules: { userAgent: "*", allow: "/", disallow: "/admin" }, sitemap: "https://kimsnails.com/sitemap.xml" }; }
