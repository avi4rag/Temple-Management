// Free Pilgrim Shuttle & Eco-Bus Transit Service (Veraval Jn ⇄ Shree Somnath Mandir)

const STORAGE_KEY = 'divya_setu_shuttle_passes_v1';

export const shuttleService = {
  getStops: () => [
    { id: 'veraval_station', name: 'Veraval Railway Junction (PF 1 Exit)', landmark: 'Opposite Main Booking Office', sequence: 1 },
    { id: 'bhadrakali_chowk', name: 'Bhadrakali Chowk', landmark: 'Heritage Archway', sequence: 2 },
    { id: 'triveni_sangam', name: 'Triveni Sangam Pilgrimage Ghat', landmark: 'Hiran-Kapila-Saraswati Confluence', sequence: 3 },
    { id: 'somnath_gate_2', name: 'Shree Somnath Mandir Digvijay Dwar', landmark: 'Main Temple Gate #2', sequence: 4 },
  ],

  getFleetStatus: () => [
    {
      id: 'SHUTTLE-01',
      plateNumber: 'GJ-11-ET-1008',
      vehicleType: '32-Seater Electric AC Eco-Bus',
      driverName: 'Govindbhai Parmar',
      contact: '+91 94272 55101',
      currentLocation: 'Bhadrakali Chowk (En Route to Temple)',
      destination: 'Digvijay Dwar (Gate 2)',
      etaMinutes: 6,
      status: 'In Transit',
      speedKmh: 34,
      batteryPct: 82,
      occupancy: '26 / 32 Seats',
    },
    {
      id: 'SHUTTLE-02',
      plateNumber: 'GJ-11-ET-1009',
      vehicleType: '32-Seater Electric AC Eco-Bus',
      driverName: 'Kiritbhai Solanki',
      contact: '+91 94272 55102',
      currentLocation: 'Veraval Railway Station PF-1 Exit Bay',
      destination: 'Shree Somnath Mandir',
      etaMinutes: 2,
      status: 'Boarding Pilgrims',
      speedKmh: 0,
      batteryPct: 94,
      occupancy: '18 / 32 Seats (Boarding)',
    },
    {
      id: 'SHUTTLE-03',
      plateNumber: 'GJ-11-ET-1010',
      vehicleType: '24-Seater Divyang & Senior Priority Minibus',
      driverName: 'Devraj Bhatiya',
      contact: '+91 94272 55103',
      currentLocation: 'Somnath North Terminal Depot',
      destination: 'Triveni Sangam Ghat',
      etaMinutes: 12,
      status: 'Scheduled',
      speedKmh: 0,
      batteryPct: 100,
      occupancy: 'Ready for Dispatch',
    },
  ],

  generateShuttlePass: (data) => {
    const year = new Date().getFullYear();
    const rand = Math.floor(1000 + Math.random() * 9000);
    const passNumber = `SST-BUS-${year}-${rand}`;
    const newPass = {
      passNumber,
      passengerName: data.passengerName || 'Devotee',
      passengersCount: data.passengersCount || 1,
      trainNumber: data.trainNumber || 'General Arrival',
      pickupStop: data.pickupStop || 'Veraval Railway Junction (PF 1 Exit)',
      dropStop: data.dropStop || 'Shree Somnath Mandir Digvijay Dwar',
      validDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      issuedAt: new Date().toISOString(),
      fare: '₹0 (Free Seva by Shree Somnath Trust)',
      gateAccess: 'Platform 1 Shuttle Bay Priority Boarding',
    };

    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      localStorage.setItem(STORAGE_KEY, JSON.stringify([newPass, ...existing]));
    } catch {
      // localStorage fallback
    }

    return newPass;
  },

  getStoredPasses: () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  },
};
