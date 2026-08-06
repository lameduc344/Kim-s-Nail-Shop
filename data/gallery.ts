export type GalleryImage = {
  title: string;
  category: "Acrylic" | "Gel" | "Designs" | "Pedicure";
  image: string;
};

export const galleryImages: GalleryImage[] = [
  { title: "Petal gloss", category: "Gel", image: "https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=900&q=85" },
  { title: "Rose chrome", category: "Acrylic", image: "https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=900&q=85&sat=-10" },
  { title: "Sunday french", category: "Designs", image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=900&q=85" },
  { title: "Soft minimal", category: "Gel", image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=900&q=85&sat=-35" },
  { title: "Summer shine", category: "Pedicure", image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=85" },
  { title: "Golden hour", category: "Designs", image: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=900&q=85" },
];
