const mongoose = require('mongoose');
require('dotenv').config();

const Complaint = require('./models/Complaint');

const testComplaintData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const complaints = await Complaint.find();
    console.log(`\n📊 COMPLAINT STATISTICS:`);
    console.log(`Total Complaints: ${complaints.length}`);
    
    if (complaints.length > 0) {
      const statusCounts = {};
      const categoryCounts = {};
      
      complaints.forEach(complaint => {
        statusCounts[complaint.status] = (statusCounts[complaint.status] || 0) + 1;
        categoryCounts[complaint.category] = (categoryCounts[complaint.category] || 0) + 1;
      });
      
      console.log('\n📈 By Status:');
      Object.entries(statusCounts).forEach(([status, count]) => {
        console.log(`  ${status}: ${count}`);
      });
      
      console.log('\n📋 By Category:');
      Object.entries(categoryCounts).forEach(([category, count]) => {
        console.log(`  ${category}: ${count}`);
      });
      
      console.log('\n🔍 Sample Complaints:');
      complaints.slice(0, 3).forEach((complaint, index) => {
        console.log(`  ${index + 1}. ${complaint.title} - ${complaint.status} (${complaint.category})`);
      });
    } else {
      console.log('❌ No complaints found in database');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

testComplaintData();