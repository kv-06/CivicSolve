const nodemailer = require('nodemailer');

class NotificationService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      service: 'gmail', // or your preferred email service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  // Send email notification
  async sendEmail(to, subject, html, text) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
        text
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Error sending email:', error);
      return { success: false, error: error.message };
    }
  }

  // Send complaint status update notification
  async sendComplaintStatusUpdate(complaint, user) {
    const statusMessages = {
      'reported': 'Your complaint has been received and is under review.',
      'in_progress': 'Your complaint is now being processed by our team.',
      'resolved': 'Your complaint has been resolved! Thank you for your patience.',
      'closed': 'Your complaint has been closed.'
    };

    const subject = `Complaint Status Update - ${complaint.title}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2196F3;">Complaint Status Update</h2>
        <p>Dear ${user.name},</p>
        <p>We wanted to inform you about the status of your complaint:</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">${complaint.title}</h3>
          <p><strong>Complaint ID:</strong> ${complaint.complaintId}</p>
          <p><strong>Category:</strong> ${complaint.category}</p>
          <p><strong>Location:</strong> ${complaint.location}</p>
          <p><strong>Status:</strong> <span style="color: #2196F3; font-weight: bold;">${complaint.status.replace('_', ' ').toUpperCase()}</span></p>
        </div>
        
        <p>${statusMessages[complaint.status]}</p>
        
        ${complaint.workOrderNumber ? `<p><strong>Work Order Number:</strong> ${complaint.workOrderNumber}</p>` : ''}
        
        <p>Thank you for using our civic problem reporting system.</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    `;

    const text = `
      Complaint Status Update - ${complaint.title}
      
      Dear ${user.name},
      
      We wanted to inform you about the status of your complaint:
      
      Complaint ID: ${complaint.complaintId}
      Category: ${complaint.category}
      Location: ${complaint.location}
      Status: ${complaint.status.replace('_', ' ').toUpperCase()}
      
      ${statusMessages[complaint.status]}
      
      ${complaint.workOrderNumber ? `Work Order Number: ${complaint.workOrderNumber}` : ''}
      
      Thank you for using our civic problem reporting system.
    `;

    return await this.sendEmail(user.email, subject, html, text);
  }

  // Send new complaint notification to admin
  async sendNewComplaintNotification(complaint, user) {
    const subject = `New Complaint Reported - ${complaint.title}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f44336;">New Complaint Reported</h2>
        <p>A new complaint has been reported in the system:</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">${complaint.title}</h3>
          <p><strong>Complaint ID:</strong> ${complaint.complaintId}</p>
          <p><strong>Category:</strong> ${complaint.category}</p>
          <p><strong>Priority:</strong> ${complaint.priority.toUpperCase()}</p>
          <p><strong>Location:</strong> ${complaint.location}</p>
          <p><strong>Description:</strong> ${complaint.description}</p>
          <p><strong>Reported by:</strong> ${user.name} (${user.email})</p>
          <p><strong>Reported on:</strong> ${new Date(complaint.createdDate).toLocaleString()}</p>
        </div>
        
        <p>Please review and assign this complaint to the appropriate department.</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          This is an automated notification from the civic problem reporting system.
        </p>
      </div>
    `;

    const text = `
      New Complaint Reported - ${complaint.title}
      
      A new complaint has been reported in the system:
      
      Complaint ID: ${complaint.complaintId}
      Category: ${complaint.category}
      Priority: ${complaint.priority.toUpperCase()}
      Location: ${complaint.location}
      Description: ${complaint.description}
      Reported by: ${user.name} (${user.email})
      Reported on: ${new Date(complaint.createdDate).toLocaleString()}
      
      Please review and assign this complaint to the appropriate department.
    `;

    // Send to admin email (configure this in environment variables)
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@civicsolve.com';
    return await this.sendEmail(adminEmail, subject, html, text);
  }

  // Send weekly summary report
  async sendWeeklySummary(stats) {
    const subject = 'Weekly Complaint Summary Report';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2196F3;">Weekly Complaint Summary</h2>
        <p>Here's a summary of complaints for the past week:</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Overall Statistics</h3>
          <p><strong>Total Complaints:</strong> ${stats.overall.total}</p>
          <p><strong>New Reports:</strong> ${stats.overall.reported}</p>
          <p><strong>In Progress:</strong> ${stats.overall.inProgress}</p>
          <p><strong>Resolved:</strong> ${stats.overall.resolved}</p>
          <p><strong>Closed:</strong> ${stats.overall.closed}</p>
        </div>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">By Category</h3>
          ${stats.byCategory.map(cat => `<p><strong>${cat._id}:</strong> ${cat.count}</p>`).join('')}
        </div>
        
        <p>Keep up the great work in addressing civic issues!</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          This is an automated weekly summary from the civic problem reporting system.
        </p>
      </div>
    `;

    const text = `
      Weekly Complaint Summary Report
      
      Here's a summary of complaints for the past week:
      
      Overall Statistics:
      - Total Complaints: ${stats.overall.total}
      - New Reports: ${stats.overall.reported}
      - In Progress: ${stats.overall.inProgress}
      - Resolved: ${stats.overall.resolved}
      - Closed: ${stats.overall.closed}
      
      By Category:
      ${stats.byCategory.map(cat => `- ${cat._id}: ${cat.count}`).join('\n')}
      
      Keep up the great work in addressing civic issues!
    `;

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@civicsolve.com';
    return await this.sendEmail(adminEmail, subject, html, text);
  }
}

module.exports = new NotificationService();
