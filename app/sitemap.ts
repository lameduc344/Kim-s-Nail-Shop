import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
const routes = ["", "/services", "/gallery", "/about", "/booking", "/contact", "/employment", "/privacy"];
export default function sitemap(): MetadataRoute.Sitemap { return routes.map((route) => ({ url: `${SITE_URL}${route}`, lastModified: new Date(), changeFrequency: "weekly", priority: route === "" ? 1 : 0.8 })); }
