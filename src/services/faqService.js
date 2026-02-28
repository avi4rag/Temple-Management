// Shree Somnath Trust Pilgrim FAQ & Help Desk Knowledge Base

export const faqService = {
  getCategories: () => [
    { id: "all", label: "All Questions" },
    { id: "darshan", label: "Darshan & Queues" },
    { id: "aarti", label: "Aartis & Rituals" },
    { id: "dresscode", label: "Dress Code & Security" },
    { id: "lockers", label: "Cloakrooms & Lockers" },
    { id: "accessibility", label: "Senior Citizens & Divyang" },
    { id: "prasad", label: "Bhojanalaya & Prasad" },
  ],

  getFAQs: () => [
    {
      id: "faq-1",
      category: "darshan",
      question: "What are the sanctum darshan timings at Shree Somnath Temple?",
      answer: "The temple doors open daily from 06:00 AM to 10:00 PM. During Maha Shivratri and Shravan Somwar, 24-hour Akhand Continuous Darshan is observed under special festival protocols.",
    },
    {
      id: "faq-2",
      category: "darshan",
      question: "Is online pre-booking of darshan tokens mandatory?",
      answer: "While physical queue entry is available, pre-booking a Divya Setu digital token is strongly recommended to guarantee entry within your chosen 30-minute window and bypass general queue congestion.",
    },
    {
      id: "faq-3",
      category: "aarti",
      question: "What are the timings of the daily Aartis?",
      answer: "Three principal Aartis are performed daily: 1) Mangla Aarti at 07:00 AM, 2) Madhyahna (Noon) Aarti at 12:00 PM, and 3) Sandhya Deepa Aarti at 07:00 PM. Entry to the Sabha Mandapa is permitted 30 minutes prior to aarti.",
    },
    {
      id: "faq-4",
      category: "aarti",
      question: "When does the 'Jay Somnath' Light & Sound Show take place?",
      answer: "The grand Light & Sound 3D Projection show is held every evening from 08:00 PM to 09:00 PM behind the temple facing the Arabian Sea (subject to weather and non-monsoon seasons). Tickets are ₹100-₹200.",
    },
    {
      id: "faq-5",
      category: "dresscode",
      question: "What is the mandatory dress code for entering the Garbhagriha?",
      answer: "Traditional attire is required. Men must wear Dhoti with Kurta or Angavastram (unstitched traditional cloth). Women must wear Saree or Salwar Kameez with Dupatta. Western denim, shorts, miniskirts, and sleeveless t-shirts are strictly banned inside the sanctum.",
    },
    {
      id: "faq-6",
      category: "dresscode",
      question: "Are mobile phones, smartwatches, and cameras allowed inside?",
      answer: "No. Gujarat Police and Temple Trust security protocols strictly prohibit all mobile phones, smartwatches, cameras, leather belts, and tobacco. Free electronic lockers are provided at Gate 1 and Gate 2.",
    },
    {
      id: "faq-7",
      category: "lockers",
      question: "Is there a charge for using the cloakroom or mobile lockers?",
      answer: "No, all cloakroom facilities, mobile lockers, and footwear stands are 100% Free of Cost, provided as a complimentary seva by Shree Somnath Trust. You receive a digital locker token with biometric protection.",
    },
    {
      id: "faq-8",
      category: "accessibility",
      question: "What facilities exist for senior citizens and persons with disabilities?",
      answer: "Shree Somnath Trust provides free wheelchairs, electric golf-cart shuttles from North Parking to Gate 2, tactile pathway guides, and barrier-free ramp access directly into the Sabha Mandapa with dedicated priority seva guides.",
    },
    {
      id: "faq-9",
      category: "prasad",
      question: "Where can devotees have Mahaprasad (Bhojan)?",
      answer: "Shree Somnath Trust Mahaprasad Bhojanalaya (Annakshetra) operates adjacent to the main promenade, serving pure satvik Gujarati thali from 11:00 AM to 03:00 PM (Lunch) and 07:00 PM to 10:00 PM (Dinner) at a subsidized token of ₹50.",
    },
    {
      id: "faq-10",
      category: "prasad",
      question: "Can I receive consecrated Somnath dry prasad at my home via postal courier?",
      answer: "Yes, sacred postal prasad boxes containing Bilva Patra, Panchamrit peda, Gangajal, and sanctum vibhuti can be dispatched across India through India Post Speed Post via the Postal Prasad service.",
    },
  ],

  submitUnresolvedQuery: (queryData) => {
    try {
      const existing = JSON.parse(localStorage.getItem("divya_setu_unresolved_faqs") || "[]");
      const record = {
        id: Date.now(),
        ...queryData,
        submittedAt: new Date().toISOString(),
        status: "Open",
      };
      existing.unshift(record);
      localStorage.setItem("divya_setu_unresolved_faqs", JSON.stringify(existing.slice(0, 50)));
      return record;
    } catch {
      return null;
    }
  },

  getUnresolvedQueries: () => {
    try {
      return JSON.parse(localStorage.getItem("divya_setu_unresolved_faqs") || "[]");
    } catch {
      return [];
    }
  },
};
