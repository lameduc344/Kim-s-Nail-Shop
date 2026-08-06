"use client";

import { useState } from "react";
import Image from "next/image";
import { galleryImages } from "@/data/gallery";

export function GalleryGrid({ limit }: { limit?: number }) {
  const [category, setCategory] = useState("All");
  const images = (limit ? galleryImages.slice(0, limit) : galleryImages).filter((item) => category === "All" || item.category === category);
  const categories = ["All", "Acrylic", "Gel", "Designs", "Pedicure"];
  return <><div className="gallery-filters" aria-label="Filter gallery">{categories.map((item) => <button className={category === item ? "active" : ""} key={item} onClick={() => setCategory(item)} type="button">{item}</button>)}</div><div className="portfolio-grid">{images.map((item) => <article className="portfolio-card" key={item.title}><Image src={item.image} alt={`${item.title} nail art`} width={900} height={1100} /><div><span>{item.category}</span><h3>{item.title}</h3></div></article>)}</div></>;
}
