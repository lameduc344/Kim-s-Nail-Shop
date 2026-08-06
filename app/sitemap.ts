import type { MetadataRoute } from "next";
const routes = ["", "/services", "/gallery", "/about", "/booking", "/contact"];
export default function sitemap(): MetadataRoute.Sitemap { return routes.map((route) => ({ url: `https://kimsnails.com${route}`, lastModified: new Date(), changeFrequency: "weekly", priority: route === "" ? 1 : 0.8 })); }
