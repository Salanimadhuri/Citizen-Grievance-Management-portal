const cron = require('node-cron');
const Complaint = require('../models/Complaint');
const { updatePriorityScores } = require('./aiUtils');

// Run escalation check every hour
const startEscalationSystem = () => {
  cron.schedule('0 * * * *', async () => {
    try {
      console.log('Running escalation check...');
      
      const complaints = await Complaint.find({
        status: { $ne: 'Resolved' },
        escalated: { $ne: true }
      }).populate('departmentId');
      
      let escalatedCount = 0;
      
      for (const complaint of complaints) {
        const hoursOpen = (Date.now() - new Date(complaint.createdAt)) / (1000 * 60 * 60);
        const slaHours = complaint.departmentId?.slaHours || 48;
        
        if (hoursOpen > slaHours) {
          await Complaint.findByIdAndUpdate(complaint._id, { escalated: true });
          escalatedCount++;
        }
      }
      
      console.log(`Escalated ${escalatedCount} complaints`);
      
      // Update priority scores
      await updatePriorityScores(Complaint);
      console.log('Priority scores updated');
      
    } catch (error) {
      console.error('Escalation system error:', error);
    }
  });
  
  console.log('Escalation system started - running every hour');
};

module.exports = { startEscalationSystem };