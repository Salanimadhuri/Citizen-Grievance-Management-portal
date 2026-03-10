const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Department = require('./models/Department');

const seedDefaultData = async () => {
  try {
    // Check if departments exist
    const departmentCount = await Department.countDocuments();
    if (departmentCount === 0) {
      console.log('Creating default departments...');
      const departments = [
        { name: 'Electricity', slaHours: 24, contactEmail: 'electricity@city.gov' },
        { name: 'Water Supply', slaHours: 48, contactEmail: 'water@city.gov' },
        { name: 'Road & Infrastructure', slaHours: 72, contactEmail: 'roads@city.gov' },
        { name: 'Waste Management', slaHours: 24, contactEmail: 'waste@city.gov' },
        { name: 'Public Safety', slaHours: 12, contactEmail: 'safety@city.gov' }
      ];
      
      const createdDepartments = await Department.insertMany(departments);
      console.log(`Created ${createdDepartments.length} departments`);
    }

    // Check if officers exist
    const officerCount = await User.countDocuments({ role: 'officer' });
    if (officerCount === 0) {
      console.log('Creating default officers...');
      
      const departments = await Department.find();
      const officers = [];
      
      for (const dept of departments) {
        officers.push({
          name: `${dept.name} Officer`,
          email: `${dept.name.toLowerCase().replace(/\s+/g, '')}@city.gov`,
          phone: '9876543210',
          password: await bcrypt.hash('password123', 10),
          role: 'officer',
          status: 'approved',
          department: dept._id
        });
      }
      
      const createdOfficers = await User.insertMany(officers);
      console.log(`Created ${createdOfficers.length} officers`);
    }

    console.log('Default data seeding completed');
  } catch (error) {
    console.error('Error seeding default data:', error);
  }
};

module.exports = seedDefaultData;