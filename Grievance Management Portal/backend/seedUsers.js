const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({});

    const users = [
      {
        name: 'Test Citizen',
        email: 'citizen@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'citizen',
        phone: '1234567890'
      },
      {
        name: 'Test Officer',
        email: 'officer@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'officer',
        phone: '1234567891'
      },
      {
        name: 'Test Admin',
        email: 'admin@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'admin',
        phone: '1234567892'
      }
    ];

    await User.insertMany(users);
    console.log('✅ Users seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

seedUsers();
