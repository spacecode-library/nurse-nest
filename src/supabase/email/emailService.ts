import { generateNurseApplicationTemplate, generateNurseHireTemplate } from "./template/appliedJob";

import sgMail from '@sendgrid/mail';

// sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// const msg = {
//   to: 'rahulkumarhavit@gmail.com', 
//   from: 'contact@nursenest.us', 
//   subject: 'Sending with SendGrid is Fun',
//   text: 'and easy to do anywhere, even with Node.js',
//   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
// }
// sgMail
//   .send(msg)
//   .then(() => {
//     console.log('Email sent')
//   })
//   .catch((error) => {
//     console.error(error)
//   })

export class EmailService {

  /**
   * Send a generic email
   * @param {Object} emailData - Email configuration object
   * @param {string} emailData.to - Recipient email
   * @param {string} emailData.from - Sender email
   * @param {string} emailData.subject - Email subject
   * @param {string} emailData.text - Plain text content
   * @param {string} emailData.html - HTML content
   */

    async sendConfirmationEmail({ to, subject, text, html }) {
      const response = await fetch('https://hjgspbyckknhoetrifko.supabase.co/functions/v1/clever-action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: to,
          subject: subject,
          text: text,
          html: html,
        }),
      });
  
      const result = await response.json();
      console.log('Email response:', result);
    }

  

 /**
   * Send nurse job application confirmation email
   * @param {string} nurseName - Name of the nurse
   * @param {string} jobCode - Job code for the position
   * @param {string} nurseEmail - Nurse's email address
   */
  async sendNurseApplicationEmail(nurseName, jobCode, nurseEmail) {
    const htmlTemplate = generateNurseApplicationTemplate(nurseName, jobCode);
    console.log(nurseEmail)
    const emailData = {
      to: nurseEmail,
      // from: 'contact@nursenest.us',
      subject: `Application Confirmation - Job Code: ${jobCode}`,
      text: `Dear ${nurseName},\n\nThank you for applying to Job Code: ${jobCode}. We have received your application and will review it shortly.\n\nBest regards,\nNurseNest Team`,
      html: htmlTemplate
    };

    return await this.sendConfirmationEmail(emailData);
  }

   /**
   * Send nurse hire confirmation email
   * @param nurseName - Name of the nurse
   * @param jobCode - Job code for the position
   * @param nurseEmail - Nurse's email address
   * @param startDate - Start date for the position
   * @param position - Job position title
   */
  async sendNurseHireEmail(
    nurseName: string, 
    jobCode: string, 
    nurseEmail: string,
    benifit: string,
    
  ){
    const htmlTemplate = generateNurseHireTemplate(nurseName, jobCode, benifit);
    
    const emailData = {
      to: nurseEmail,
      subject: `🎉 Welcome to NurseNest - You're Hired! (Job Code: ${jobCode})`,
      text: `Dear ${nurseName},\n\nCongratulations! We are pleased to offer you the position (Job Code: ${jobCode}).`,
      html: htmlTemplate
    };

    return await this.sendConfirmationEmail(emailData);
  }

  /**
   * Send notification to admin about new nurse application
   * @param {string} nurseName - Name of the nurse
   * @param {string} jobCode - Job code for the position
   * @param {string} nurseEmail - Nurse's email address
   * @param {string} adminEmail - Admin email address
   */
  async sendAdminNotification(nurseName, jobCode, nurseEmail, adminEmail = 'admin@nursenest.us') {
    const emailData = {
      to: adminEmail,
      from: 'contact@nursenest.us',
      subject: `New Nurse Application - Job Code: ${jobCode}`,
      text: `New application received from ${nurseName} (${nurseEmail}) for Job Code: ${jobCode}`,
      html: `
        <h2>New Nurse Application Received</h2>
        <p><strong>Nurse Name:</strong> ${nurseName}</p>
        <p><strong>Email:</strong> ${nurseEmail}</p>
        <p><strong>Job Code:</strong> ${jobCode}</p>
        <p><strong>Application Time:</strong> ${new Date().toLocaleString()}</p>
        <p>Please review the application in the admin dashboard.</p>
      `
    };

    return await this.sendConfirmationEmail(emailData);
  }
}