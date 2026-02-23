// Arabian Sea Coastal Weather & Maritime Tide Advisory Service for Somnath Coast

export const weatherService = {
  getCoastalForecast: () => {
    const now = new Date();
    const currentHour = now.getHours();

    // Determine tide cycle based on hour (Somnath coastal semi-diurnal tide model)
    const isHighTide = (currentHour >= 11 && currentHour <= 14) || (currentHour >= 23 || currentHour <= 2);
    const tideHeight = isHighTide ? 3.4 : 1.1; // meters

    return {
      location: 'Shree Somnath Coastal Promenade (Prabhas Patan)',
      coordinates: '20.8880° N, 70.4012° E',
      temperatureC: 27,
      feelsLikeC: 29,
      humidityPct: 74,
      windSpeedKmh: 19,
      windDirection: 'SW (From Arabian Sea)',
      uvIndex: currentHour >= 11 && currentHour <= 15 ? 8 : 2,
      sunsetTime: '06:44 PM',
      tide: {
        status: isHighTide ? 'High Tide (Rising Waves)' : 'Low Tide (Normal Water Level)',
        heightMeters: tideHeight,
        isWarningActive: isHighTide,
        nextHighTide: '12:45 PM',
        nextLowTide: '06:55 PM',
        advisory: isHighTide
          ? 'High tide alert: Coastal walkway experience active wave spray. Pilgrims advised to stay behind security barriers.'
          : 'Low tide: Sea walkway and Baan Stambh promenade are open and safe for parikrama.',
      },
      seaCondition: isHighTide ? 'Moderate Swell' : 'Calm Waters',
      waterSafetyFlag: isHighTide ? 'Yellow (Exercise Caution)' : 'Green (Safe for Devotees)',
      updatedAt: now.toISOString(),
    };
  },

  getMarineSafetyHotlines: () => [
    { title: 'Somnath Coast Guard Station', phone: '+91 2876 231102' },
    { title: 'Gujarat Maritime Board Patrol', phone: '+91 2876 220044' },
    { title: 'Prabhas Patan Marine Police', phone: '+91 2876 220100' },
  ],
};
