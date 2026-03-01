// Postal Prasad Courier Delivery Service (India Post Speed Post Integration)

const STORAGE_KEY = "divya_setu_postal_prasad_orders";

const PRASAD_CATALOG = [
  {
    id: "prasad-standard",
    name: "Shree Somnath Mahaprasad Box (Silver Seal)",
    price: 251,
    weight: "500 grams",
    shelfLife: "45 Days (Nitrogen sealed)",
    deliveryDays: "3-5 business days",
    badge: "Most Popular",
    contents: [
      "Pure Desi Ghee Dry Fruit Ladoos (4 pcs)",
      "Sacred Jyotirlinga Bhasma & Vibhuti packet",
      "Sanctum blessed Belpatra with Chandan Tilak",
      "Somnath Jyotirlinga gold-foil pocket yantra",
      "Triveni Sangam Holy Tirtha Jal (30ml vial)",
    ],
    description: "Vacuum-sealed sacred prasad prepared in Shree Somnath Trust modern hygienic kitchen, sanctified during morning Maha Aarti.",
  },
  {
    id: "prasad-deluxe",
    name: "Divya Mahaprasad Grand Hamper (Gold Seal)",
    price: 501,
    weight: "1000 grams",
    shelfLife: "45 Days (Nitrogen sealed)",
    deliveryDays: "2-4 business days",
    badge: "Family Seva",
    contents: [
      "Dry Fruit Kaju-Pista Besan Ladoos (8 pcs)",
      "Pure Kashmir Kesar & Chandan Ashtagandha",
      "Panchamrit sanctified dry mawa peda (4 pcs)",
      "Original 5-Mukhi Rudraksha bead blessed in sanctum",
      "Mahamrityunjaya Stotram prayer scripture booklet",
      "Triveni Sangam Jal bottle (60ml sealed)",
    ],
    description: "Comprehensive divine hamper ideal for family celebrations, griha pravesh, or auspicious blessings delivered directly to your doorstep.",
  },
  {
    id: "prasad-rudraksha",
    name: "Sanctum Abhisheka Rudraksha Kavach & Prasad",
    price: 1100,
    weight: "750 grams",
    shelfLife: "60 Days",
    deliveryDays: "2-3 business days (Priority)",
    badge: "Special Abhishekam",
    contents: [
      "Silver capped 5-Mukhi Rudraksha with lab certificate",
      "Somnath Temple pure copper consecrated coin",
      "Shree Somnath Dry Fruit Ladoos (6 pcs)",
      "Dwadasha Jyotirlinga Darshan copper plaque",
      "Panchamrut & Ganga-Triveni sacred snan jal (100ml)",
    ],
    description: "Specially sanctified during 11 Rudri chanting Abhishekam at the Adya Jyotirlinga altar.",
  },
];

const INITIAL_ORDERS = [
  {
    id: "ORD-PRASAD-101",
    consignmentNumber: "EM82910482IN",
    prasadId: "prasad-standard",
    prasadName: "Shree Somnath Mahaprasad Box (Silver Seal)",
    recipientName: "Sanjay Dave",
    phone: "9825144320",
    address: "B-204, Shivam Heights, Ring Road",
    city: "Rajkot",
    state: "Gujarat",
    pincode: "360005",
    quantity: 1,
    totalAmount: 251,
    paymentStatus: "Paid (UPI)",
    orderDate: "2026-02-27",
    status: "Dispatched",
    courierPartner: "India Post Speed Post",
    estDeliveryDate: "2026-03-01",
  },
  {
    id: "ORD-PRASAD-102",
    consignmentNumber: "EM82910599IN",
    prasadId: "prasad-deluxe",
    prasadName: "Divya Mahaprasad Grand Hamper (Gold Seal)",
    recipientName: "Anita Sharma",
    phone: "9810234511",
    address: "Flat 12, Sector 15, Dwarka",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110075",
    quantity: 2,
    totalAmount: 1002,
    paymentStatus: "Paid (Card)",
    orderDate: "2026-02-28",
    status: "Packaging in Trust Dispatch Cell",
    courierPartner: "India Post Speed Post",
    estDeliveryDate: "2026-03-04",
  },
];

export const prasadService = {
  getCatalog: () => PRASAD_CATALOG,

  getPrasadById: (id) => PRASAD_CATALOG.find((p) => p.id === id) || PRASAD_CATALOG[0],

  validatePincode: (pin) => {
    const cleaned = (pin || "").trim();
    if (!/^\d{6}$/.test(cleaned)) {
      return { valid: false, message: "PIN code must be exactly 6 digits." };
    }

    const firstTwo = cleaned.substring(0, 2);
    let state = "India";
    let estDays = 4;

    if (["36", "37", "38", "39"].includes(firstTwo)) {
      state = "Gujarat";
      estDays = 2;
    } else if (["40", "41", "42", "43", "44"].includes(firstTwo)) {
      state = "Maharashtra";
      estDays = 3;
    } else if (["11", "12", "13", "20", "28"].includes(firstTwo)) {
      state = "Delhi NCR / North India";
      estDays = 3;
    } else if (["56", "57", "58", "60", "61", "62", "50", "51", "52"].includes(firstTwo)) {
      state = "South India";
      estDays = 4;
    } else if (["70", "71", "72", "75", "76", "77", "80"].includes(firstTwo)) {
      state = "East / Central India";
      estDays = 4;
    } else {
      state = "India";
      estDays = 5;
    }

    return {
      valid: true,
      state,
      estDays,
      speedPostServiceable: true,
      shippingCharge: 0, // Complimentary seva by Shree Somnath Trust
    };
  },

  getOrders: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return INITIAL_ORDERS;
  },

  createOrder: (orderPayload) => {
    const orders = prasadService.getOrders();
    const orderNumber = `ORD-PRASAD-${Math.floor(100 + Math.random() * 900)}`;
    const random8 = Math.floor(10000000 + Math.random() * 90000000);
    const consignmentNumber = `EM${random8}IN`;

    const prasadItem = prasadService.getPrasadById(orderPayload.prasadId);
    const pinInfo = prasadService.validatePincode(orderPayload.pincode);

    const estDelivery = new Date();
    estDelivery.setDate(estDelivery.getDate() + (pinInfo.estDays || 3));

    const newOrder = {
      id: orderNumber,
      consignmentNumber,
      prasadId: prasadItem.id,
      prasadName: prasadItem.name,
      recipientName: orderPayload.recipientName,
      phone: orderPayload.phone,
      address: orderPayload.address,
      city: orderPayload.city,
      state: orderPayload.state || pinInfo.state,
      pincode: orderPayload.pincode,
      quantity: Number(orderPayload.quantity) || 1,
      totalAmount: (prasadItem.price * (Number(orderPayload.quantity) || 1)),
      paymentStatus: "Confirmed (Online Seva)",
      orderDate: new Date().toISOString().split("T")[0],
      status: "Order Confirmed - Sacred Packing",
      courierPartner: "India Post Speed Post",
      estDeliveryDate: estDelivery.toISOString().split("T")[0],
      trackingHistory: [
        {
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          date: new Date().toISOString().split("T")[0],
          location: "Prabhas Patan Somnath Trust Dispatch Desk",
          status: "Order booked & consecrated in sanctum",
        },
      ],
    };

    const updated = [newOrder, ...orders];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // storage quota or private mode
    }

    return newOrder;
  },

  updateOrderStatus: (orderId, newStatus, locationUpdate = "Veraval Head Post Office (RMS)") => {
    const orders = prasadService.getOrders();
    const updated = orders.map((ord) => {
      if (ord.id === orderId) {
        const history = ord.trackingHistory || [];
        return {
          ...ord,
          status: newStatus,
          trackingHistory: [
            {
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              date: new Date().toISOString().split("T")[0],
              location: locationUpdate,
              status: newStatus,
            },
            ...history,
          ],
        };
      }
      return ord;
    });

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // fallback
    }
    return updated;
  },
};
