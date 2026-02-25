// Temple Festival Surge Protocols & Special Ritual Management Service

const STORAGE_KEY = 'divya_setu_festival_mode_v1';

export const festivalService = {
  getProfiles: () => ({
    normal: {
      id: 'normal',
      name: 'Regular Darshan Operations',
      badge: 'Normal Day',
      capacity: 5000,
      sanctumHours: '06:00 AM - 10:00 PM',
      isContinuousDarshan: false,
      bannerText: 'Standard temple darshan schedule and normal queue flow.',
    },
    mahashivratri: {
      id: 'mahashivratri',
      name: 'Maha Shivratri Maha Mahotsav',
      badge: '🔱 Maha Shivratri Protocol',
      capacity: 22000,
      sanctumHours: '24 Hours Continuous (Akhand Darshan)',
      isContinuousDarshan: true,
      bannerText: 'Akhand 24-Hour Sanctum Darshan active! Four Prahar Abhishek ceremonies throughout the holy night.',
      prahars: [
        { name: 'Pratham Prahar (06:00 PM - 09:00 PM)', abhishek: 'Dugdha (Sacred Cow Milk) Abhishek', crowd: 'High' },
        { name: 'Dvitiya Prahar (09:00 PM - 12:00 AM)', abhishek: 'Dadhi (Curd) Abhishek & Bilva Archana', crowd: 'Very High' },
        { name: 'Nishita Kaal / 3rd Prahar (12:00 AM - 03:00 AM)', abhishek: 'Ghrita (Ghee) & Sugarcane Juice Abhishek', crowd: 'Peak (Auspicious)' },
        { name: 'Chaturtha Prahar (03:00 AM - 06:00 AM)', abhishek: 'Madhu (Honey) & Bhasma Aarti', crowd: 'High' },
      ],
      specialFeatures: [
        'Dedicated Bilva Patra offering counters',
        '24-Hour free satvik phalahar at Annakshetra',
        'Direct coastal barricades for crowd dispersal',
        'Emergency fast-track queue for senior citizens',
      ],
    },
    shravan: {
      id: 'shravan',
      name: 'Holy Shravan Maas Mahotsav',
      badge: '🌿 Shravan Maas Protocol',
      capacity: 15000,
      sanctumHours: '05:30 AM - 10:30 PM (Extended)',
      isContinuousDarshan: false,
      bannerText: 'Holy Shravan month special Somwar pujas, continuous Jalabhishek, and evening Damru Aarti.',
    },
  }),

  getActiveFestival: () => {
    try {
      const mode = localStorage.getItem(STORAGE_KEY) || 'mahashivratri';
      const profiles = festivalService.getProfiles();
      return profiles[mode] || profiles.normal;
    } catch {
      return festivalService.getProfiles().mahashivratri;
    }
  },

  setFestivalMode: (modeId) => {
    try {
      localStorage.setItem(STORAGE_KEY, modeId);
    } catch {
      // storage fallback
    }
    return festivalService.getActiveFestival();
  },
};

export const getActiveFestivalProtocol = () => festivalService.getActiveFestival();
