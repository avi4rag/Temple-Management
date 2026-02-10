import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { env } from '../src/config/env.js';
import { Staff } from '../src/models/Staff.js';
import { TimeSlot } from '../src/models/TimeSlot.js';
import { Camera } from '../src/models/Camera.js';
import { Notification } from '../src/models/Notification.js';

async function seed() {
  console.log('Connecting to database:', env.MONGODB_URI);
  await mongoose.connect(env.MONGODB_URI);

  console.log('--- Starting Idempotent Seeding ---');

  // 1. Seed Staff Users
  const defaultPasswordHash = await bcrypt.hash('TempleAdmin@2026', 12);
  const staffMembers = [
    {
      name: 'Chief Temple Administrator',
      email: 'admin@somnath.temple',
      passwordHash: defaultPasswordHash,
      role: 'super_admin',
      phone: '9876543210',
      isActive: true,
    },
    {
      name: 'Gate Supervisor Rajesh',
      email: 'gate@somnath.temple',
      passwordHash: defaultPasswordHash,
      role: 'gate_staff',
      phone: '9876543211',
      isActive: true,
    },
    {
      name: 'Crowd Controller Anand',
      email: 'crowd@somnath.temple',
      passwordHash: defaultPasswordHash,
      role: 'crowd_manager',
      phone: '9876543212',
      isActive: true,
    },
    {
      name: 'Security Officer Vikram',
      email: 'security@somnath.temple',
      passwordHash: defaultPasswordHash,
      role: 'security',
      phone: '9876543213',
      isActive: true,
    },
  ];

  for (const staffData of staffMembers) {
    const existing = await Staff.findOne({ email: staffData.email });
    if (!existing) {
      await Staff.create(staffData);
      console.log(`Created staff member: ${staffData.email} (${staffData.role})`);
    } else {
      console.log(`Staff member already exists: ${staffData.email}`);
    }
  }

  // 2. Seed Cameras
  const cameras = [
    {
      name: 'CAM-01 Sanctum Entrance',
      location: 'Garbhagriha / Inner Sanctum',
      zoneId: 'sanctum',
      streamUrl: 'https://demo-streams.temple.org/live/cam-01/index.m3u8',
      status: 'online',
      fps: 30,
      resolution: '1080p',
    },
    {
      name: 'CAM-02 Sabha Mandapa Center',
      location: 'Sabha Mandapa (Assembly Hall)',
      zoneId: 'sabha_mandapa',
      streamUrl: 'https://demo-streams.temple.org/live/cam-02/index.m3u8',
      status: 'online',
      fps: 30,
      resolution: '1080p',
    },
    {
      name: 'CAM-03 East Gate Queue Line',
      location: 'East Entry Gate',
      zoneId: 'east_gate',
      streamUrl: 'https://demo-streams.temple.org/live/cam-03/index.m3u8',
      status: 'online',
      fps: 30,
      resolution: '1080p',
    },
    {
      name: 'CAM-04 West Gate Exit Corridor',
      location: 'West Exit Corridor',
      zoneId: 'west_gate',
      streamUrl: 'https://demo-streams.temple.org/live/cam-04/index.m3u8',
      status: 'online',
      fps: 30,
      resolution: '1080p',
    },
    {
      name: 'CAM-05 Pilgrim Holding Plaza',
      location: 'Outer Courtyard & Holding Area',
      zoneId: 'plaza',
      streamUrl: 'https://demo-streams.temple.org/live/cam-05/index.m3u8',
      status: 'online',
      fps: 30,
      resolution: '1080p',
    },
    {
      name: 'CAM-06 Mahaprasad Counter',
      location: 'Prasad Distribution Hall',
      zoneId: 'prasad_counter',
      streamUrl: 'https://demo-streams.temple.org/live/cam-06/index.m3u8',
      status: 'online',
      fps: 30,
      resolution: '1080p',
    },
  ];

  for (const cam of cameras) {
    await Camera.findOneAndUpdate({ name: cam.name }, cam, { upsert: true, new: true });
    console.log(`Synced camera: ${cam.name} in zone ${cam.zoneId}`);
  }

  // 3. Seed Time Slots for the next 7 days
  const defaultSlotHours = [
    { startTime: '06:00', endTime: '07:30', capacity: 500 },
    { startTime: '07:30', endTime: '09:00', capacity: 600 },
    { startTime: '09:00', endTime: '10:30', capacity: 700 },
    { startTime: '10:30', endTime: '12:00', capacity: 700 },
    { startTime: '12:00', endTime: '13:30', capacity: 400 },
    { startTime: '16:00', endTime: '17:30', capacity: 600 },
    { startTime: '17:30', endTime: '19:00', capacity: 800 },
    { startTime: '19:00', endTime: '20:30', capacity: 800 },
    { startTime: '20:30', endTime: '21:30', capacity: 500 },
  ];

  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + i);
    const dateStr = targetDate.toISOString().slice(0, 10);

    for (const slotDef of defaultSlotHours) {
      await TimeSlot.findOneAndUpdate(
        { date: dateStr, startTime: slotDef.startTime },
        {
          date: dateStr,
          startTime: slotDef.startTime,
          endTime: slotDef.endTime,
          capacity: slotDef.capacity,
          notes: 'Standard General Darshan',
        },
        { upsert: true, setDefaultsOnInsert: true }
      );
    }
  }
  console.log('Seeded standard darshan slots for next 7 days.');

  // 4. Seed Welcome Notification
  const existingNotification = await Notification.findOne({ title: 'Welcome to Divya Setu' });
  if (!existingNotification) {
    await Notification.create({
      title: 'Welcome to Divya Setu',
      message:
        'Darshan slots are open for booking. Please carry valid government ID and arrive 15 minutes before your scheduled slot.',
      type: 'announcement',
      targetAudience: 'all',
      active: true,
    });
    console.log('Seeded default announcement notification.');
  }

  console.log('--- Seeding completed successfully ---');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
