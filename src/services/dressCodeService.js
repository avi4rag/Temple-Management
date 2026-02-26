// Shree Somnath Jyotirlinga Sanctum Dress Code & Security Compliance Guidelines

export const dressCodeService = {
  getDressCodeRules: () => ({
    title: "Sanctum Sanctorum (Garbhagriha) Traditional Dress Code",
    lastUpdated: "Somnath Trust Protocol 2026",
    male: {
      permitted: [
        "Traditional Dhoti with Kurta or Angavastram (unstitched cloth)",
        "Traditional Kurta Pajama (sober and respectful colours)",
        "Dhoti / Veshti with bare upper body or Angavastra for Abhishek",
      ],
      strictlyProhibited: [
        "Western jeans, ripped denim, or cargo pants inside sanctum",
        "Shorts, Bermudas, capris, or track pants",
        "Sleeveless t-shirts, printed graphic jerseys, or gym wear",
        "Leather belts (must be placed in free cloakroom)",
      ],
      recommendation: "Devotees participating in Special Sparsh Darshan / Jalabhishek MUST wear traditional Dhoti.",
    },
    female: {
      permitted: [
        "Traditional Saree with blouse (all varieties permitted)",
        "Salwar Kameez or Churidar with traditional Dupatta / Chunni",
        "Traditional Anarkali / Lehenga Choli with full scarf",
      ],
      strictlyProhibited: [
        "Western jeans, t-shirts, crop tops, or tracksuits",
        "Miniskirts, midi dresses, or sleeveless gowns",
        "Nightwear, sheer fabrics, or transparent attire",
      ],
      recommendation: "Devotees are requested to cover their head with Saree pallu or Dupatta during sanctum viewing.",
    },
    children: {
      permitted: [
        "Traditional dhoti-kurta, kurta-pajama, or modest festive attire",
        "Traditional pavada / salwar or traditional cotton dresses",
      ],
    },
    prohibitedItems: [
      { name: "Mobile Phones & Smartwatches", penalty: "Strictly banned past Gate 2", icon: "Smartphone" },
      { name: "Leather Belts & Pure Leather Wallets", penalty: "Must be deposited at Gate 1 Cloakroom", icon: "Briefcase" },
      { name: "Cameras & Audio Recorders", penalty: "Strictly confiscated if breached", icon: "Camera" },
      { name: "Tobacco, Bidi, Cigarettes & Gutkha", penalty: "Prohibited by Gujarat Police regulations", icon: "Ban" },
      { name: "Outside Liquids & Flammables", penalty: "Only Trust-consecrated Gangajal/Panchamrit allowed", icon: "Flame" },
    ],
    cloakroomFacilities: {
      gate1: "Cloakroom Counter 1 (Main Promenade) - Free mobile lockers & luggage deposit",
      gate2: "Cloakroom Counter 2 (VIP/Senior Gate) - Footwear stands & leather item drop",
      cost: "100% Free of Cost (Provided by Shree Somnath Trust)",
      timings: "05:30 AM to 10:30 PM daily",
    },
  }),
};
