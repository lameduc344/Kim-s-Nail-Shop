export type Service = {
  name: string;
  price: string;
  duration: string;
  description: string;
};

export type ServiceCategory = {
  category: string;
  image: string;
  items: Service[];
};

export const services: ServiceCategory[] = [
  {
    category: "Manicure",
    image: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=900&q=85",
    items: [
      { name: "Classic Manicure", price: "$35", duration: "45 min", description: "A meticulous shape, cuticle care, massage, and polish." },
      { name: "Gel Manicure", price: "$45", duration: "60 min", description: "Long-lasting shine with professional gel polish." },
      { name: "Spa Manicure", price: "$55", duration: "75 min", description: "An indulgent exfoliation, mask, and extended massage." },
    ],
  },
  {
    category: "Pedicure",
    image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=85",
    items: [
      { name: "Classic Pedicure", price: "$45", duration: "50 min", description: "A restorative reset for feet that do it all." },
      { name: "Deluxe Spa Pedicure", price: "$60", duration: "70 min", description: "Scrub, mask, warm towel wrap, and extra massage time." },
      { name: "Hot Stone Pedicure", price: "$75", duration: "85 min", description: "The deluxe ritual, finished with tension-melting hot stones." },
    ],
  },
  {
    category: "Enhancements",
    image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=900&q=85",
    items: [
      { name: "Acrylic Full Set", price: "$65", duration: "90 min", description: "A custom-shaped set with your choice of finish, from rich solids to statement art." },
      { name: "Gel X Extensions", price: "$75", duration: "90 min", description: "Lightweight, flexible extensions with a natural feel." },
      { name: "Dip Powder", price: "$55", duration: "75 min", description: "Durable, richly pigmented color without a UV finish." },
      { name: "Freestyle Nail Art", price: "$20+", duration: "30 min", description: "Custom art, chrome, gems, and expressive details designed around your vision." },
    ],
  },
];

export const featuredServices = services.map(({ category, image, items }) => ({
  name: items[0].name,
  price: items[0].price,
  time: items[0].duration,
  image,
  category,
}));
