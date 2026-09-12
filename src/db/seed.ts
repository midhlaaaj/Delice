import bcrypt from "bcryptjs";
import { db } from "./index";
import { products, stores, ugcVideos, adminUsers } from "./schema";

const CHEESECAKES = [
  {
    slug: "vanilla",
    name: "Classic Vanilla Bean",
    kicker: "The original",
    priceLabel: "₹149",
    description:
      "Slow-baked New York style with real vanilla bean flecks and a buttery biscuit base. Where it all started.",
    colorFrom: "#EFC3CD",
    colorTo: "#D68C9E",
    sortOrder: 0,
  },
  {
    slug: "blueberry",
    name: "Blueberry Cheesecake",
    kicker: "Fan favorite",
    priceLabel: "₹169",
    description:
      "Tangy blueberry compote swirled through our classic base, topped with fresh berries.",
    colorFrom: "#9A6289",
    colorTo: "#5F3450",
    sortOrder: 1,
  },
  {
    slug: "mango",
    name: "Mango Delice",
    kicker: "Seasonal",
    priceLabel: "₹159",
    description: "Alphonso mango puree layered over vanilla cheesecake — a Kerala summer favorite.",
    colorFrom: "#F0A868",
    colorTo: "#D97A2E",
    sortOrder: 2,
  },
  {
    slug: "chocolate",
    name: "Belgian Chocolate",
    kicker: "Rich & dense",
    priceLabel: "₹179",
    description:
      "Dark Belgian chocolate ganache over a rich cocoa cheesecake base, for the serious chocolate lover.",
    colorFrom: "#7A4A34",
    colorTo: "#40200F",
    sortOrder: 3,
  },
  {
    slug: "strawberry",
    name: "Strawberry Rose",
    kicker: "Delicate & floral",
    priceLabel: "₹169",
    description: "Fresh strawberry compote with a whisper of rose water, topped with petals.",
    colorFrom: "#DD8E8B",
    colorTo: "#B4494A",
    sortOrder: 4,
  },
  {
    slug: "pistachio",
    name: "Pistachio Kunafa",
    kicker: "Nutty & honeyed",
    priceLabel: "₹189",
    description: "Crushed pistachio and crisp kunafa strands over a honeyed cheesecake base.",
    colorFrom: "#A9B98E",
    colorTo: "#6E7E55",
    sortOrder: 5,
  },
].map((p) => ({
  ...p,
  category: "cheesecake" as const,
  isFeaturedOnWheel: p.slug !== "strawberry",
}));

const BAKES = [
  {
    slug: "yema-cake",
    name: "Yema Cake",
    kicker: "Caramel milk custard",
    priceLabel: "₹399",
    description: "Soft sponge layered with Filipino-style caramel milk custard.",
    colorFrom: "#DE8A4C",
    colorTo: "#C96B32",
    sortOrder: 6,
  },
  {
    slug: "dark-chocolate-loaf",
    name: "Dark Chocolate Loaf",
    kicker: "70% cocoa, dense crumb",
    priceLabel: "₹349",
    description: "A dense, fudgy loaf made with 70% dark chocolate.",
    colorFrom: "#5A3222",
    colorTo: "#3C1F14",
    sortOrder: 7,
  },
  {
    slug: "pistachio-roll",
    name: "Pistachio Roll",
    kicker: "Whipped cream, crushed nuts",
    priceLabel: "₹329",
    description: "Light sponge roll with whipped cream and crushed pistachio.",
    colorFrom: "#8B9B72",
    colorTo: "#5E6E48",
    sortOrder: 8,
  },
].map((p) => ({
  ...p,
  category: "bake" as const,
  isFeaturedOnWheel: false,
}));

const STORES = [
  {
    name: "Sweet Corner Bakery",
    addressLine: "Mavoor Road",
    city: "Kozhikode",
    lat: 11.2588,
    lng: 75.7804,
    isOwnOutlet: true,
    isApproved: true,
  },
  {
    name: "Cafe Delight",
    addressLine: "Palazhi",
    city: "Kozhikode",
    lat: 11.2743,
    lng: 75.7963,
    isOwnOutlet: false,
    isApproved: true,
  },
  {
    name: "The Pastry Shelf",
    addressLine: "Cherootty Road",
    city: "Kozhikode",
    lat: 11.2529,
    lng: 75.7745,
    isOwnOutlet: false,
    isApproved: true,
  },
  { name: "Beach Road Bakes", addressLine: "Beach Road", city: "Kozhikode", lat: 11.2497, lng: 75.7746, isOwnOutlet: false, isApproved: true },
  { name: "Malabar Sweet House", addressLine: "SM Street", city: "Kozhikode", lat: 11.2534, lng: 75.7810, isOwnOutlet: false, isApproved: true },
  { name: "Broadway Confections", addressLine: "Broadway", city: "Kochi", lat: 9.9658, lng: 76.2422, isOwnOutlet: true, isApproved: true },
  { name: "Marine Drive Cafe", addressLine: "Marine Drive", city: "Kochi", lat: 9.9756, lng: 76.2789, isOwnOutlet: false, isApproved: true },
  { name: "Fort Kochi Bake Studio", addressLine: "Fort Kochi", city: "Kochi", lat: 9.9654, lng: 76.2424, isOwnOutlet: false, isApproved: true },
  { name: "Edappally Sweet Corner", addressLine: "Edappally", city: "Kochi", lat: 10.0261, lng: 76.3080, isOwnOutlet: false, isApproved: true },
  { name: "Kakkanad Cake House", addressLine: "Kakkanad", city: "Kochi", lat: 10.0158, lng: 76.3419, isOwnOutlet: false, isApproved: true },
  { name: "Round South Bakery", addressLine: "Round South", city: "Thrissur", lat: 10.5276, lng: 76.2144, isOwnOutlet: true, isApproved: true },
  { name: "Sakthan Cafe", addressLine: "Sakthan Thampuran Nagar", city: "Thrissur", lat: 10.5222, lng: 76.2144, isOwnOutlet: false, isApproved: true },
  { name: "Punkunnam Pastries", addressLine: "Punkunnam", city: "Thrissur", lat: 10.5326, lng: 76.1953, isOwnOutlet: false, isApproved: true },
  { name: "Fort Road Sweets", addressLine: "Fort Road", city: "Kannur", lat: 11.8745, lng: 75.3704, isOwnOutlet: true, isApproved: true },
  { name: "Baby Beach Bakes", addressLine: "Baby Beach Road", city: "Kannur", lat: 11.8689, lng: 75.3549, isOwnOutlet: false, isApproved: true },
  { name: "Chinnakada Confections", addressLine: "Chinnakada", city: "Kollam", lat: 8.8932, lng: 76.6141, isOwnOutlet: true, isApproved: true },
  { name: "Asramam Bake House", addressLine: "Asramam", city: "Kollam", lat: 8.9089, lng: 76.5901, isOwnOutlet: false, isApproved: true },
  { name: "Statue Junction Sweets", addressLine: "Statue Junction", city: "Thiruvananthapuram", lat: 8.5074, lng: 76.9564, isOwnOutlet: true, isApproved: true },
  { name: "Kowdiar Cake Studio", addressLine: "Kowdiar", city: "Thiruvananthapuram", lat: 8.5225, lng: 76.9581, isOwnOutlet: false, isApproved: true },
  { name: "Technopark Cafe", addressLine: "Technopark Campus", city: "Thiruvananthapuram", lat: 8.5580, lng: 76.8807, isOwnOutlet: false, isApproved: true },
  { name: "MG Road Patisserie", addressLine: "MG Road", city: "Kottayam", lat: 9.5916, lng: 76.5222, isOwnOutlet: true, isApproved: true },
  { name: "Nagampadam Bakes", addressLine: "Nagampadam", city: "Kottayam", lat: 9.5942, lng: 76.5312, isOwnOutlet: false, isApproved: true },
  { name: "Ashok Road Sweets", addressLine: "Ashok Road", city: "Alappuzha", lat: 9.4981, lng: 76.3388, isOwnOutlet: true, isApproved: true },
  { name: "Mullakkal Cafe", addressLine: "Mullakkal", city: "Alappuzha", lat: 9.4900, lng: 76.3255, isOwnOutlet: false, isApproved: true },
  { name: "Palayam Bake Corner", addressLine: "Palayam", city: "Kozhikode", lat: 11.2467, lng: 75.7773, isOwnOutlet: false, isApproved: true },
  { name: "Civil Station Cafe", addressLine: "Civil Station Road", city: "Kannur", lat: 11.8781, lng: 75.3826, isOwnOutlet: false, isApproved: true },
];

const VIDEOS = [
  { handle: "@keralafoodie", caption: "This blueberry cheesecake from Delice is unreal 😍" },
  { handle: "@thattukada.eats", caption: "Mango Delice hits different in this heat 🥭" },
  { handle: "@munch_with_meera", caption: "Boxed this fresh from the Mavoor Road store" },
  { handle: "@dessertdiaries", caption: "Belgian chocolate slice, no notes." },
  { handle: "@snackspottt", caption: "Found @delice at a shop in Kochi today!" },
  { handle: "@ente_kitchen", caption: "Pistachio kunafa cheesecake >>>" },
].map((v, i) => ({
  ...v,
  videoUrl: "",
  sortOrder: i,
}));

async function main() {
  console.log("Seeding products...");
  await db.insert(products).values([...CHEESECAKES, ...BAKES]).onConflictDoNothing({
    target: products.slug,
  });

  console.log("Seeding stores...");
  await db.insert(stores).values(STORES).onConflictDoNothing({
    target: [stores.name, stores.addressLine],
  });

  console.log("Seeding UGC videos...");
  await db.insert(ugcVideos).values(VIDEOS).onConflictDoNothing({
    target: [ugcVideos.handle, ugcVideos.caption],
  });

  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  if (adminEmail && adminPassword) {
    console.log("Seeding admin user...");
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await db
      .insert(adminUsers)
      .values({ email: adminEmail.toLowerCase(), passwordHash, name: "Admin" })
      .onConflictDoNothing({ target: adminUsers.email });
  } else {
    console.warn("SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD not set — skipping admin user.");
  }

  console.log("Done.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
