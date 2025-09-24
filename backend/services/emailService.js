const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // You can use other services like SendGrid, Mailgun, etc.
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS  // Your email password or app password
      }
    });

    // Alternative configuration for other email services
    // this.transporter = nodemailer.createTransporter({
    //   host: 'smtp.gmail.com',
    //   port: 587,
    //   secure: false,
    //   auth: {
    //     user: process.env.EMAIL_USER,
    //     pass: process.env.EMAIL_PASS
    //   }
    // });
  }

  // Generate complaint confirmation email HTML
  generateComplaintConfirmationEmail(complaintData, user) {
    const { _id, title, description, category, status, createdAt } = complaintData;
    const complaintUrl = `${process.env.FRONTEND_URL}/complaint/${_id}`;
    
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Complaint Confirmation</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f4f4f4;
            }
            .email-container {
                background-color: #ffffff;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            .header {
                background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
                color: white;
                padding: 30px 20px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: bold;
            }
            .header p {
                margin: 10px 0 0 0;
                opacity: 0.9;
                font-size: 16px;
            }
            .content {
                padding: 30px;
            }
            .complaint-details {
                background-color: #f8f9fa;
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
                border-left: 4px solid #2196F3;
            }
            .detail-row {
                display: flex;
                margin-bottom: 12px;
                align-items: flex-start;
            }
            .detail-label {
                font-weight: 600;
                color: #555;
                min-width: 120px;
                margin-right: 10px;
            }
            .detail-value {
                color: #333;
                flex: 1;
            }
            .status-badge {
                display: inline-block;
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .status-pending {
                background-color: #fff3cd;
                color: #856404;
            }
            .status-in-progress {
                background-color: #d1ecf1;
                color: #0c5460;
            }
            .status-resolved {
                background-color: #d4edda;
                color: #155724;
            }
            .view-button {
                display: inline-block;
                background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
                color: white;
                padding: 12px 30px;
                text-decoration: none;
                border-radius: 25px;
                font-weight: 600;
                font-size: 16px;
                margin: 20px 0;
                transition: all 0.3s ease;
                box-shadow: 0 2px 4px rgba(33, 150, 243, 0.3);
            }
            .view-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(33, 150, 243, 0.4);
            }
            .footer {
                background-color: #f8f9fa;
                padding: 20px;
                text-align: center;
                font-size: 14px;
                color: #666;
                border-top: 1px solid #e9ecef;
            }
            .footer a {
                color: #2196F3;
                text-decoration: none;
            }
            .success-icon {
                text-align: center;
                font-size: 48px;
                color: #4CAF50;
                margin-bottom: 20px;
            }
            @media only screen and (max-width: 600px) {
                body { padding: 10px; }
                .content { padding: 20px; }
                .detail-row { flex-direction: column; }
                .detail-label { min-width: auto; margin-bottom: 5px; }
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <h1>✅ Complaint Registered Successfully</h1>
                <p>Your issue has been lodged and we're on it!</p>
            </div>
            
            <div class="content">
                <div class="success-icon">🎯</div>
                
                <p>Dear <strong>${user.name}</strong>,</p>
                
                <p>Thank you for reporting the issue. Your complaint has been successfully registered in our system and assigned a unique tracking ID.</p>
                
                <div class="complaint-details">
                    <h3 style="margin-top: 0; color: #2196F3;">📋 Complaint Details</h3>
                    
                    <div class="detail-row">
                        <div class="detail-label">Complaint ID:</div>
                        <div class="detail-value"><strong>#${_id.toString().slice(-8).toUpperCase()}</strong></div>
                    </div>
                    
                    <div class="detail-row">
                        <div class="detail-label">Title:</div>
                        <div class="detail-value"><strong>${title}</strong></div>
                    </div>
                    
                    <div class="detail-row">
                        <div class="detail-label">Category:</div>
                        <div class="detail-value">${category}</div>
                    </div>
                    
                    <div class="detail-row">
                        <div class="detail-label">Status:</div>
                        <div class="detail-value">
                            <span class="status-badge status-${status.toLowerCase().replace(' ', '-')}">${status}</span>
                        </div>
                    </div>
                    
                    <div class="detail-row">
                        <div class="detail-label">Submitted:</div>
                        <div class="detail-value">${new Date(createdAt).toLocaleString('en-IN', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</div>
                    </div>
                    
                    <div class="detail-row">
                        <div class="detail-label">Description:</div>
                        <div class="detail-value">${description.length > 150 ? description.substring(0, 150) + '...' : description}</div>
                    </div>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${complaintUrl}" class="view-button">
                        🔍 View Full Complaint Details
                    </a>
                </div>
                
                <div style="background-color: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h4 style="color: #1976D2; margin-top: 0;">📢 What happens next?</h4>
                    <ul style="color: #555; padding-left: 20px;">
                        <li>Our team will review your complaint within <strong>24 hours</strong></li>
                        <li>You'll receive updates via email as the status changes</li>
                        <li>You can track progress using the complaint ID: <strong>#${_id.toString().slice(-8).toUpperCase()}</strong></li>
                        <li>Expected resolution time: <strong>3-7 business days</strong></li>
                    </ul>
                </div>
                
                <p style="color: #666; font-size: 14px;">
                    <strong>Need help?</strong> Contact our support team at 
                    <a href="mailto:support@yourapp.com" style="color: #2196F3;">support@yourapp.com</a> 
                    or call us at <strong>1800-123-4567</strong>
                </p>
            </div>
            
            <div class="footer">
                <p>This is an automated message. Please do not reply to this email.</p>
                <p>
                    <a href="${process.env.FRONTEND_URL}">Visit Our Portal</a> | 
                    <a href="${process.env.FRONTEND_URL}/unsubscribe">Unsubscribe</a> | 
                    <a href="${process.env.FRONTEND_URL}/privacy">Privacy Policy</a>
                </p>
                <p style="margin-top: 15px; font-size: 12px; color: #999;">
                    © 2024 Citizen Complaint Portal. Making communities better, one complaint at a time.
                </p>
            </div>
        </div>
    </body>
    </html>`;
  }

  // Send complaint confirmation email
  async sendComplaintConfirmation(user, complaintData) {
    try {
      // HARDCODED EMAIL FOR TESTING - No validation needed
      const testEmail = "abishna27@gmail.com";

      const mailOptions = {
        from: {
          name: 'Citizen Complaint Portal',
          address: process.env.EMAIL_USER
        },
        to: testEmail, // Hardcoded for testing
        subject: `✅ Complaint Registered - ID #${complaintData._id.toString().slice(-8).toUpperCase()}`,
        html: this.generateComplaintConfirmationEmail(complaintData, user),
        // Plain text version for email clients that don't support HTML
        text: `
Dear ${user.name},

Your complaint has been successfully registered!

Complaint Details:
- ID: #${complaintData._id.toString().slice(-8).toUpperCase()}
- Title: ${complaintData.title}
- Category: ${complaintData.category}
- Status: ${complaintData.status}
- Submitted: ${new Date(complaintData.createdAt).toLocaleString()}

You can view your complaint details at: ${process.env.FRONTEND_URL}/complaint/${complaintData._id}

Our team will review your complaint within 24 hours and you'll receive updates via email.

Thank you for helping improve our community!

Citizen Complaint Portal Team
        `
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Complaint confirmation email sent successfully to:', testEmail, 'MessageID:', info.messageId);
      return { success: true, messageId: info.messageId };
      
    } catch (error) {
      console.error('Error sending complaint confirmation email to:', testEmail, 'Error:', error);
      throw new Error(`Failed to send confirmation email: ${error.message}`);
    }
  }

  // Send status update email when complaint status changes
  async sendStatusUpdateEmail(user, complaintData, oldStatus, newStatus) {
    try {
      // HARDCODED EMAIL FOR TESTING - No validation needed
      const testEmail = "abishna27@gmail.com";

      const statusColors = {
        'pending': '#ffc107',
        'in-progress': '#17a2b8',
        'resolved': '#28a745',
        'closed': '#6c757d',
        'rejected': '#dc3545'
      };

      const statusEmojis = {
        'pending': '⏳',
        'in-progress': '🔄',
        'resolved': '✅',
        'closed': '📁',
        'rejected': '❌'
      };

      const mailOptions = {
        from: {
          name: 'Citizen Complaint Portal',
          address: process.env.EMAIL_USER
        },
        to: testEmail, // FIXED: Now using hardcoded email for testing
        subject: `${statusEmojis[newStatus.toLowerCase()]} Complaint Status Updated - ID #${complaintData._id.toString().slice(-8).toUpperCase()}`,
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #2196F3; color: white; padding: 20px; text-align: center;">
            <h2>Complaint Status Update</h2>
          </div>
          <div style="padding: 20px;">
            <p>Dear ${user.name},</p>
            <p>The status of your complaint has been updated:</p>
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Complaint ID:</strong> #${complaintData._id.toString().slice(-8).toUpperCase()}</p>
              <p><strong>Title:</strong> ${complaintData.title}</p>
              <p><strong>Previous Status:</strong> <span style="color: ${statusColors[oldStatus.toLowerCase()] || '#6c757d'}">${oldStatus}</span></p>
              <p><strong>New Status:</strong> <span style="color: ${statusColors[newStatus.toLowerCase()] || '#6c757d'}">${statusEmojis[newStatus.toLowerCase()]} ${newStatus}</span></p>
              ${complaintData.adminComments ? `<p><strong>Admin Comments:</strong> ${complaintData.adminComments}</p>` : ''}
            </div>
            <div style="text-align: center; margin: 20px 0;">
              <a href="${process.env.FRONTEND_URL}/complaint/${complaintData._id}" 
                 style="background-color: #2196F3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                View Complaint Details
              </a>
            </div>
          </div>
        </div>
        `,
        text: `
Dear ${user.name},

Your complaint status has been updated:

Complaint ID: #${complaintData._id.toString().slice(-8).toUpperCase()}
Title: ${complaintData.title}
Previous Status: ${oldStatus}
New Status: ${newStatus}
${complaintData.adminComments ? `Admin Comments: ${complaintData.adminComments}` : ''}

View details: ${process.env.FRONTEND_URL}/complaint/${complaintData._id}

Thank you!
Citizen Complaint Portal Team
        `
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Status update email sent successfully to:', testEmail, 'MessageID:', info.messageId);
      return { success: true, messageId: info.messageId };
      
    } catch (error) {
      console.error('Error sending status update email to:', testEmail, 'Error:', error);
      throw new Error(`Failed to send status update email: ${error.message}`);
    }
  }

  // Email validation helper
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Test email configuration
  async testEmailConfig() {
    try {
      await this.transporter.verify();
      console.log('✅ Email configuration is valid');
      return { success: true, message: 'Email configuration is valid' };
    } catch (error) {
      console.error('❌ Email configuration error:', error);
      return { success: false, message: error.message };
    }
  }

  // Send test email
  async sendTestEmail(testEmail = null) {
    try {
      const recipient = testEmail || "abishna27@gmail.com"; // Default to hardcoded email
      
      const mailOptions = {
        from: {
          name: 'Citizen Complaint Portal',
          address: process.env.EMAIL_USER
        },
        to: recipient,
        subject: '🧪 Test Email - Complaint Portal',
        html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2196F3;">✅ Email Test Successful!</h2>
          <p>If you're reading this, your email configuration is working correctly.</p>
          <p><strong>Sent at:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>From:</strong> ${process.env.EMAIL_USER}</p>
          <p><strong>To:</strong> ${recipient}</p>
        </div>
        `,
        text: `
Email Test Successful!

If you're reading this, your email configuration is working correctly.

Sent at: ${new Date().toLocaleString()}
From: ${process.env.EMAIL_USER}
To: ${recipient}
        `
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Test email sent successfully to:', recipient, 'MessageID:', info.messageId);
      return { success: true, messageId: info.messageId, recipient };
      
    } catch (error) {
      console.error('❌ Error sending test email:', error);
      throw new Error(`Failed to send test email: ${error.message}`);
    }
  }
}

module.exports = new EmailService();
