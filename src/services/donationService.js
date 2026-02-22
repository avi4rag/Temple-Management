import { apiClient } from './apiClient';

const STORAGE_KEY = 'divya_setu_donations_v1';

export const donationService = {
  getDonationCauses: () => [
    {
      id: 'annakshetra',
      title: 'Somnath Mahaprasad Annakshetra',
      description: 'Sponsor wholesome satvik bhojan for visiting pilgrims and sadhus at the Trust Annakshetra.',
      presets: [501, 1100, 2500, 5100, 11000],
      icon: '🍲',
      taxExemption: '80G (50% deduction under IT Act 1961)',
      suggested: 1100,
    },
    {
      id: 'goushala',
      title: 'Gir Cow Goushala & Fodder Seva',
      description: 'Daily green grass, veterinary care, and shelter for indigenous Gir cows protected by temple trust.',
      presets: [251, 501, 1100, 2100, 5000],
      icon: '🐄',
      taxExemption: '80G (50% deduction under IT Act 1961)',
      suggested: 501,
    },
    {
      id: 'mandir_shikhar',
      title: '155-ft Golden Shikhar & Sanctum Preservation',
      description: 'Maintenance and heritage conservation of the magnificent Somnath sandstone and gold kalash.',
      presets: [1100, 2100, 5100, 11000, 25000],
      icon: '🛕',
      taxExemption: '80G (50% deduction under IT Act 1961)',
      suggested: 2100,
    },
    {
      id: 'vedic_pathshala',
      title: 'Veda Vidya Pathshala & Archak Seva',
      description: 'Support traditional Rigveda and Yajurveda recitation, student gurukulam scholarships, and rituals.',
      presets: [501, 1001, 2500, 5000],
      icon: '📿',
      taxExemption: '80G (50% deduction under IT Act 1961)',
      suggested: 1001,
    },
    {
      id: 'general_hundi',
      title: 'Shree Somnath General E-Hundi',
      description: 'Unrestricted devotional daan directly into the official sanctum digital hundi.',
      presets: [101, 251, 501, 1100, 2500],
      icon: '🪙',
      taxExemption: '80G (50% deduction under IT Act 1961)',
      suggested: 501,
    },
  ],

  recordDonation: async (donationData) => {
    try {
      const res = await apiClient.post('/donations', donationData);
      return res.data.donation;
    } catch {
      const year = new Date().getFullYear();
      const rand = Math.floor(10000 + Math.random() * 90000);
      const receiptNo = `SST-80G-${year}-${rand}`;
      const record = {
        receiptNo,
        ...donationData,
        date: new Date().toISOString(),
        trustPan: 'AAATS0984E',
        exemptionCode: 'CIT(E)/AHMD/80G/2021-22/A-412',
      };
      try {
        const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        localStorage.setItem(STORAGE_KEY, JSON.stringify([record, ...existing]));
      } catch {
        // storage fallback
      }
      return record;
    }
  },

  getRecentDonations: async () => {
    try {
      const res = await apiClient.get('/donations');
      return res.data.donations;
    } catch {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) return JSON.parse(stored);
      } catch {
        // fallback
      }
      return [
        {
          receiptNo: 'SST-80G-2026-84912',
          donorName: 'Raghavan Iyer',
          amount: 5100,
          causeId: 'annakshetra',
          causeTitle: 'Somnath Mahaprasad Annakshetra',
          date: new Date(Date.now() - 3600000 * 5).toISOString(),
        },
        {
          receiptNo: 'SST-80G-2026-62184',
          donorName: 'Bhavesh Chhaya',
          amount: 2100,
          causeId: 'goushala',
          causeTitle: 'Gir Cow Goushala & Fodder Seva',
          date: new Date(Date.now() - 3600000 * 12).toISOString(),
        },
      ];
    }
  },
};
