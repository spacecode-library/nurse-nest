
/**
   * Generate HTML template for nurse hire confirmation
   * @param nurseName - Name of the nurse
   * @param jobCode - Job code for the position
   * @param benifit - benifit
   * @param position - Job position title
   */
  export function generateNurseHireTemplate(nurseName: string, jobCode: string, benifit: string,): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to NurseNest - You're Hired!</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f8f9fa;
            }
            .email-container {
                background-color: #ffffff;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 2px solid #e9ecef;
            }
            .logo {
                font-size: 28px;
                font-weight: bold;
                color: #2c5aa0;
                margin-bottom: 10px;
            }
            .welcome-banner {
                background: linear-gradient(135deg, #28a745, #20c997);
                color: white;
                padding: 25px;
                border-radius: 10px;
                text-align: center;
                margin-bottom: 30px;
            }
            .main-content {
                margin-bottom: 30px;
            }
            .highlight {
                background-color: #d4edda;
                padding: 15px;
                border-radius: 8px;
                margin: 20px 0;
                border-left: 4px solid #28a745;
            }
            .job-details {
                background-color: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
                border: 1px solid #dee2e6;
            }
            .onboarding-steps {
                background-color: #fff3cd;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
                border-left: 4px solid #ffc107;
            }
            .footer {
                text-align: center;
                padding-top: 20px;
                border-top: 1px solid #e9ecef;
                color: #666;
                font-size: 14px;
            }
            .button {
                display: inline-block;
                padding: 12px 25px;
                background-color: #28a745;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                margin: 15px 0;
                font-weight: bold;
            }
            .celebration-icon {
                font-size: 60px;
                text-align: center;
                margin-bottom: 20px;
            }
            .important-note {
                background-color: #f8d7da;
                color: #721c24;
                padding: 15px;
                border-radius: 8px;
                margin: 20px 0;
                border-left: 4px solid #dc3545;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <div class="logo">🏥 NurseNest</div>
                <p style="color: #666; margin: 0;">Professional Healthcare Staffing</p>
            </div>

            <div class="celebration-icon">🎉</div>

            <div class="welcome-banner">
                <h1 style="margin: 0; font-size: 32px;">Congratulations!</h1>
                <p style="margin: 10px 0 0 0; font-size: 18px;">You've been selected to join our team!</p>
            </div>

            <div class="main-content">
                <h2 style="color: #2c5aa0; margin-bottom: 20px;">Welcome to NurseNest, ${nurseName}!</h2>
                
                <p>We are thrilled to officially welcome you to the NurseNest family! After careful consideration of your qualifications and experience, we are excited to offer you the position.</p>

                <div class="job-details">
                    <h3 style="color: #28a745; margin-top: 0;">Your Position Details:</h3>
                    <p><strong>Employee Name:</strong> ${nurseName}</p>
                    <p><strong>Job Code:</strong> ${jobCode}</p>
                    <p><strong>Benifit</strong> ${benifit}</p>
                    <p><strong>Hire Date:</strong> ${new Date().toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}</p>
                </div>

                <div class="highlight">
                    <h4 style="margin-top: 0; color: #155724;">What makes you special:</h4>
                    <p style="margin-bottom: 0;">Your dedication to patient care, professional expertise, and commitment to excellence made you stand out among many qualified candidates. We believe you'll be a valuable addition to our healthcare team.</p>
                </div>

                <div class="onboarding-steps">
                    <h4 style="margin-top: 0; color: #856404;">Next Steps - Before Your Start Date:</h4>
                    <ol style="margin-bottom: 0;">
                        <li><strong>Complete Onboarding Paperwork:</strong> You'll receive a separate email with digital forms to complete</li>
                        <li><strong>Background Check & Drug Screening:</strong> Instructions will be provided within 24 hours</li>
                        <li><strong>Orientation Schedule:</strong> Your first day orientation details will be sent soon</li>
                        <li><strong>Uniform & Badge:</strong> Information about scrubs and ID badge pickup</li>
                        <li><strong>Direct Supervisor Contact:</strong> You'll be introduced to your team lead</li>
                    </ol>
                </div>

                <div class="important-note">
                    <h4 style="margin-top: 0;">⚠️ Important:</h4>
                    <p style="margin-bottom: 0;">Please ensure all onboarding requirements are completed at least 3 days before your start date. If you have any questions or concerns, contact HR immediately.</p>
                </div>

                <p>We understand that starting a new position can be both exciting and overwhelming. Our team is here to support you every step of the way to ensure your smooth transition into your new role.</p>

                <div style="text-align: center;">
                    <a href="#" class="button">Access Onboarding Portal</a>
                </div>

                <div class="highlight">
                    <h4 style="margin-top: 0; color: #155724;">Your Onboarding Coordinator:</h4>
                    <p><strong>Sarah Mitchell, HR Specialist</strong><br>
                    📧 sarah.mitchell@nursenest.us<br>
                    📞 (555) 123-4567 ext. 102<br>
                    Available: Monday-Friday, 8:00 AM - 5:00 PM</p>
                </div>
            </div>

            <div class="footer">
                <p><strong>Welcome to the NurseNest Family! 👨‍⚕️👩‍⚕️</strong></p>
                <p>📧 hr@nursenest.us | 📞 (555) 123-4567</p>
                <p>🌐 www.nursenest.us</p>
                <p style="font-size: 12px; margin-top: 15px;">
                    This is an official hiring confirmation. Please keep this email for your records.
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
  }



export function generateNurseApplicationTemplate(nurseName: string, jobCode: string): string {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Nurse Job Application Confirmation</title>
                <style>
                        body {
                                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                                line-height: 1.6;
                                color: #333;
                                max-width: 600px;
                                margin: 0 auto;
                                padding: 20px;
                                background-color: #f8f9fa;
                        }
                        .email-container {
                                background-color: #ffffff;
                                padding: 30px;
                                border-radius: 10px;
                                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                                text-align: center;
                                margin-bottom: 30px;
                                padding-bottom: 20px;
                                border-bottom: 2px solid #e9ecef;
                        }
                        .logo {
                                font-size: 28px;
                                font-weight: bold;
                                color: #2c5aa0;
                                margin-bottom: 10px;
                        }
                        .main-content {
                                margin-bottom: 30px;
                        }
                        .highlight {
                                background-color: #e3f2fd;
                                padding: 15px;
                                border-radius: 8px;
                                margin: 20px 0;
                                border-left: 4px solid #2196f3;
                        }
                        .job-details {
                                background-color: #f5f5f5;
                                padding: 20px;
                                border-radius: 8px;
                                margin: 20px 0;
                        }
                        .footer {
                                text-align: center;
                                padding-top: 20px;
                                border-top: 1px solid #e9ecef;
                                color: #666;
                                font-size: 14px;
                        }
                        .button {
                                display: inline-block;
                                padding: 12px 25px;
                                background-color: #2c5aa0;
                                color: white;
                                text-decoration: none;
                                border-radius: 5px;
                                margin: 15px 0;
                                font-weight: bold;
                        }
                        .success-icon {
                                color: #28a745;
                                font-size: 48px;
                                text-align: center;
                                margin-bottom: 20px;
                        }
                </style>
        </head>
        <body>
                <div class="email-container">
                        <div class="header">
                                <div class="logo">🏥 NurseNest</div>
                                <p style="color: #666; margin: 0;">Professional Healthcare Staffing</p>
                        </div>

                        <div class="success-icon">✅</div>

                        <div class="main-content">
                                <h2 style="color: #2c5aa0; margin-bottom: 20px;">Application Received Successfully!</h2>
                                
                                <p>Dear <strong>${nurseName}</strong>,</p>
                                
                                <p>Thank you for your interest in joining our healthcare team! We have successfully received your application and wanted to confirm the details.</p>

                                <div class="job-details">
                                        <h3 style="color: #2c5aa0; margin-top: 0;">Application Details:</h3>
                                        <p><strong>Applicant Name:</strong> ${nurseName}</p>
                                        <p><strong>Job Code:</strong> ${jobCode}</p>
                                        <p><strong>Application Date:</strong> ${new Date().toLocaleDateString('en-US', { 
                                                weekday: 'long', 
                                                year: 'numeric', 
                                                month: 'long', 
                                                day: 'numeric' 
                                        })}</p>
                                </div>

                                <div class="highlight">
                                        <h4 style="margin-top: 0; color: #1976d2;">What happens next?</h4>
                                        <ul style="margin-bottom: 0;">
                                                <li>Our hiring team will review your application within 2-3 business days</li>
                                                <li>If your qualifications match our requirements, we'll contact you for an interview</li>
                                                <li>You'll receive email updates on your application status</li>
                                        </ul>
                                </div>

                                <p>In the meantime, feel free to explore more opportunities on our platform or contact us if you have any questions.</p>

                                <div style="text-align: center;">
                                        <a href="#" class="button">View Application Status</a>
                                </div>
                        </div>

                        <div class="footer">
                                <p><strong>NurseNest Healthcare Staffing</strong></p>
                                <p>📧 contact@nursenest.us | 📞 (555) 123-4567</p>
                                <p>🌐 www.nursenest.us</p>
                                <p style="font-size: 12px; margin-top: 15px;">
                                        This is an automated message. Please do not reply to this email.
                                </p>
                        </div>
                </div>
        </body>
        </html>
        `;
}