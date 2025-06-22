import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Shield, UserCheck, Lock, Check } from 'lucide-react';

interface Document {
  id: string;
  title: string;
  icon: React.ElementType;
  content: string;
  required: boolean;
}

interface ClickwrapAgreementProps {
  userType: 'nurse' | 'client';
  onAllAccepted: (accepted: boolean) => void;
}

const NURSE_DOCUMENTS: Document[] = [
  {
    id: 'master-agreement',
    title: 'Nurse Master Agreement + Exhibits',
    icon: FileText,
    required: true,
    content: `NURSE NEST HEALTHCARE PROFESSIONAL TERMS OF SERVICE AND INDEPENDENT CONTRACTOR AGREEMENT

Effective Date: June 15, 2025 | Version 2.0

IMPORTANT NOTICE: THIS AGREEMENT CONTAINS BINDING ARBITRATION AND CLASS ACTION WAIVER PROVISIONS THAT AFFECT YOUR LEGAL RIGHTS. PLEASE READ CAREFULLY.

This Healthcare Professional Terms of Service and Independent Contractor Agreement ("Agreement") is a legally binding contract between you ("Nurse," "Professional," or "you") and Nurse Nest, LLC, a Delaware limited liability company ("Nurse Nest," "we," "us," or "our"). By creating an account, accessing our platform, or using our services, you acknowledge that you have read, understood, and agree to be bound by this Agreement.

1. PLATFORM OVERVIEW AND RELATIONSHIP

1.1 Technology Platform Only
Nurse Nest operates exclusively as a technology platform that facilitates connections between independent healthcare professionals and healthcare facilities or clients seeking nursing services. WE ARE NOT A HEALTHCARE PROVIDER, STAFFING AGENCY, OR EMPLOYER. We do not provide, recommend, endorse, or guarantee any healthcare services, nursing care, or professional qualifications.

1.2 Independent Contractor Status
YOU ARE AN INDEPENDENT CONTRACTOR, NOT AN EMPLOYEE of Nurse Nest. This relationship is fundamental to our platform model and your use of our services. You acknowledge and agree that:

• You are not entitled to any employee benefits, workers' compensation, unemployment benefits, or employment protections
• Nurse Nest does not control your work methods, schedules, or locations
• You maintain complete autonomy over accepting or declining client opportunities
• You are responsible for all tax obligations, licensing requirements, and professional compliance
• No employment, partnership, joint venture, or agency relationship exists between you and Nurse Nest
• You represent that you maintain client relationships independent of platform
• You must maintain $1M/$3M professional liability insurance naming Nurse Nest as certificate holder. Minimum coverage must be active 48 hours before first assignment.

1.3 Marketplace Facilitation
Our platform serves solely to connect independent professionals with potential clients. All nursing services, employment decisions, scheduling, supervision, and patient care responsibilities are exclusively between you and your clients.

2. PROFESSIONAL RESPONSIBILITIES AND COMPLIANCE

2.1 Licensing and Credentials
You are solely responsible for:
• Maintaining current, valid nursing licenses in all states where you practice
• Ensuring compliance with all applicable state nursing practice acts and regulations
• Obtaining any required certifications, training, or continuing education
• Immediately notifying us of any license suspensions, restrictions, or disciplinary actions
• Practicing only within your authorized scope of practice

2.2 Professional Conduct
You agree to:
• Provide nursing services consistent with applicable professional standards
• Maintain appropriate professional liability insurance
• Comply with all facility policies and procedures when providing services
• Report any incidents, errors, or safety concerns according to applicable regulations
• Maintain patient confidentiality and comply with HIPAA requirements

EXHIBIT A - BUSINESS ASSOCIATE AGREEMENT (HIPAA)

This Business Associate Agreement supplements the Nurse Master Agreement and governs the handling of Protected Health Information (PHI) as defined under the Health Insurance Portability and Accountability Act of 1996 ("HIPAA").

1. DEFINITIONS
Terms used but not defined in this BAA have the meanings assigned in 45 CFR Parts 160 and 164.

2. PERMITTED USES AND DISCLOSURES
Nurse Nest may use or disclose PHI only to the extent necessary to perform platform services and only as permitted by this BAA, the underlying service agreement, or as required by law.

3. SAFEGUARDING REQUIREMENTS
Administrative, Physical, and Technical Safeguards as required by HIPAA Security Rule.

EXHIBIT C - INDEPENDENT CONTRACTOR CLASSIFICATION

This exhibit documents Nurse Nest's compliance with independent contractor classification requirements:

1. ASSIGNMENT CONTROL DOCUMENTATION
• Platform tracks nurse acceptance/decline rates for opportunities
• No penalties for declining assignments
• Nurses maintain 100% autonomy over schedule and availability

2. EQUIPMENT AND RESOURCE PROVISIONING
• Nurses provide their own professional equipment and supplies
• Platform access provided via nurse's own devices
• No company-issued equipment

3. BUSINESS OPERATION INDEPENDENCE
• Nurses encouraged to maintain multiple revenue streams
• No exclusivity requirements or non-compete restrictions
• Nurses may work with competitors and other platforms simultaneously

EXHIBIT D - PERMITTED DRUG TESTING STATES MATRIX

This exhibit identifies jurisdictions where pre-assignment drug testing is permitted and compliant with state employment laws.

Tier 1 - Full Testing Authorization:
Alabama, Arizona, Arkansas, Florida, Georgia, Idaho, Indiana, Kansas, Louisiana, Mississippi, Missouri, Montana, North Carolina, North Dakota, Oklahoma, South Carolina, South Dakota, Tennessee, Texas, Utah, West Virginia, Wyoming

Tier 2 - Limited Testing (Safety-Sensitive Only):
Colorado, Iowa, Kentucky, Michigan, Nebraska, Nevada, New Mexico, Ohio, Virginia, Wisconsin

Tier 3 - Facility-Specific Requirements:
California (healthcare facility discretion), Illinois (patient safety positions only), New York (direct patient care roles), Pennsylvania (safety-sensitive designations)

This matrix shall be updated quarterly to reflect changes in state drug testing laws and regulations.

CLICKWRAP ACCEPTANCE:
I acknowledge that I have read and understood this entire agreement, that I am entering into this agreement voluntarily, and that this agreement is legally binding. By clicking 'I Accept,' I agree to all terms and conditions stated above. If you do not agree to these terms, do not click the acceptance button and discontinue use of this service.`
  },
  {
    id: 'background-check',
    title: 'Background Check Disclosure',
    icon: Shield,
    required: true,
    content: `DISCLOSURE REGARDING BACKGROUND INVESTIGATION

This disclosure is provided in compliance with the Fair Credit Reporting Act (FCRA), 15 U.S.C. § 1681 et seq.

IMPORTANT INFORMATION ABOUT BACKGROUND CHECKS

Nurse Nest, LLC ("Nurse Nest") may obtain information about you from a consumer reporting agency for employment or engagement purposes. This background investigation may include, but is not limited to:

Information That May Be Obtained:
• Criminal history records (federal, state, and local)
• Sex offender registry searches
• Motor vehicle records and driving history
• Employment history verification
• Education and professional license verification
• Professional reference checks
• Credit history (where permitted by law and relevant to position)
• Social Security number verification
• OIG (Office of Inspector General) exclusion list checks
• GSA (General Services Administration) debarment checks
• Drug screening and medical testing results

Consumer Reporting Agency Information:
The consumer reporting agency that may provide reports is:
Checkr, Inc.
1 Montgomery Street, Suite 2400
San Francisco, CA 94104
Phone: (844) 824-3257
Website: www.checkr.com

Your Rights Under the Fair Credit Reporting Act:
A summary of your rights under the Fair Credit Reporting Act is available at:
https://files.consumerfinance.gov/f/documents/cfpb_consumer-rights-summary_2018-09.pdf

Additional State Rights:
Depending on your state of residence, you may have additional rights regarding background checks. Information about state-specific rights is available upon request.

Consent Requirements:
Your consent to this background check is required before any consumer report may be obtained. A separate consent form accompanies this disclosure.

Questions or Concerns:
If you have questions about this disclosure or the background check process, please contact:
Nurse Nest Support
Email: contact@nursenest.us
Phone: (425) 954-3381

This disclosure is provided to comply with federal and state laws governing background checks. Please read it carefully and retain a copy for your records.

CLICKWRAP ACCEPTANCE:
I acknowledge that I have read and understood this entire agreement, that I am entering into this agreement voluntarily, and that this agreement is legally binding. By clicking 'I Accept,' I agree to all terms and conditions stated above. If you do not agree to these terms, do not click the acceptance button and discontinue use of this service.`
  },
  {
    id: 'professional-verification',
    title: 'Professional Verification Consent',
    icon: UserCheck,
    required: true,
    content: `NURSE NEST PROFESSIONAL VERIFICATION AND ONGOING MONITORING CONSENT

Effective Date: June 15, 2025

AUTHORIZATION FOR COMPREHENSIVE PROFESSIONAL VERIFICATION

By accepting this agreement, I authorize Nurse Nest, LLC and its designated third-party verification providers to conduct comprehensive verification of my professional qualifications, credentials, and ongoing compliance with applicable requirements.

1. DRUG SCREENING AND MEDICAL TESTING

1.1 Consent to Testing
I consent to drug and alcohol screening as may be required by client facilities or as part of ongoing compliance monitoring. I understand that:
• Testing will be conducted by certified laboratories
• Positive results may affect my eligibility for platform participation
• I have the right to request split sample testing for positive results
• Results will be shared with requesting facilities as applicable
• I may request copies of test results

2. PROFESSIONAL LICENSE VERIFICATION

2.1 Authorization for Verification
I authorize verification of all nursing licenses and professional credentials through:
• State licensing boards and regulatory agencies
• Primary source verification databases
• Continuing education tracking systems
• Disciplinary action reporting systems

2.2 Ongoing Monitoring
I consent to ongoing monitoring of my professional licenses, including:
• Automated alerts for license expiration or renewal
• Monitoring for disciplinary actions or restrictions
• Verification of continuing education compliance
• Multi-state license verification as applicable

3. EXCLUSION LIST MONITORING

3.1 Federal Exclusion Verification
I consent to verification against federal exclusion databases including:
• HHS Office of Inspector General List of Excluded Individuals/Entities
• General Services Administration System for Award Management (SAM)
• Nuclear Regulatory Commission exclusion lists
• Other federal debarment and exclusion databases

3.2 Ongoing Monitoring
I understand that exclusion list verification will be conducted:
• Initially upon platform registration
• Monthly during active platform participation
• Immediately upon notification of potential exclusion
• Before each new client engagement

4. EDUCATION AND EMPLOYMENT VERIFICATION

4.1 Educational Background
I authorize verification of:
• Nursing education and degree completion
• Professional training and certification programs
• Continuing education credits and compliance
• Academic disciplinary actions if applicable

4.2 Employment History
I authorize verification of:
• Previous healthcare employment
• Performance evaluations and disciplinary actions
• Termination circumstances and eligibility for rehire
• Professional references and recommendations

5. ONGOING REVERIFICATION REQUIREMENTS

5.1 Periodic Reverification
I understand and consent to periodic reverification of all credentials, including:
• Annual comprehensive background checks
• Quarterly license status verification
• Biannual drug screening (if required by facilities)
• Immediate reverification upon any reported incidents

5.2 Notification Obligations
I agree to immediately notify Nurse Nest of:
• Any changes to professional license status
• Disciplinary actions or investigations
• Criminal charges or convictions
• Exclusion from federal or state healthcare programs
• Changes in eligibility to provide healthcare services

6. INFORMATION SHARING AND PRIVACY

6.1 Authorized Disclosures
I authorize sharing of verification results with:
• Client facilities considering my services
• Regulatory agencies as required by law
• Professional licensing boards upon request
• Insurance providers for coverage verification

6.2 Privacy Protections
I understand that all verification information will be:
• Protected according to applicable privacy laws
• Shared only with authorized parties for legitimate purposes
• Maintained in secure systems with appropriate access controls
• Retained according to legal and regulatory requirements

CLICKWRAP ACCEPTANCE:
I acknowledge that I have read and understood this entire agreement, that I am entering into this agreement voluntarily, and that this agreement is legally binding. By clicking 'I Accept,' I agree to all terms and conditions stated above. If you do not agree to these terms, do not click the acceptance button and discontinue use of this service.`
  },
  {
    id: 'cybersecurity-attestation',
    title: 'Cybersecurity Attestation',
    icon: Lock,
    required: true,
    content: `NURSE NEST CYBERSECURITY AND DATA PROTECTION ATTESTATION

Effective Date: June 15, 2025

SECURITY COMPLIANCE CERTIFICATION

As a healthcare professional using the Nurse Nest platform, you play a critical role in maintaining the security and privacy of sensitive information. This attestation documents your commitment to cybersecurity best practices.

1. DEVICE AND NETWORK SECURITY

1.1 Device Protection
I certify that devices used to access the Nurse Nest platform:
• Are protected by current antivirus/anti-malware software
• Have automatic security updates enabled
• Are not shared with unauthorized individuals
• Are physically secured when not in use

1.2 Network Security
I understand and agree to:
• Use secure, private networks when accessing the platform
• Avoid public Wi-Fi for accessing sensitive information
• Use VPN services when remote access is necessary
• Report any suspected network security incidents

2. AUTHENTICATION AND ACCESS CONTROLS

2.1 Multi-Factor Authentication (MFA)
I acknowledge that:
• MFA is required for platform access
• I am responsible for securing authentication devices
• I will not share authentication credentials with others
• I will immediately report lost or compromised authentication factors

2.2 Password Management
I agree to:
• Use unique, strong passwords for my account
• Change passwords immediately if compromise is suspected
• Not store passwords in unsecured locations
• Use approved password management tools when available

3. DATA HANDLING AND PRIVACY

3.1 Protected Health Information (PHI)
I understand that:
• PHI must not be transmitted through the platform except as specifically authorized
• All PHI access must comply with HIPAA requirements
• PHI must be protected according to applicable state and federal laws
• Unauthorized PHI disclosure may result in legal liability

3.2 Platform Data Security
I agree to:
• Access only information necessary for legitimate professional purposes
• Not download or store platform data on personal devices unless specifically authorized
• Report any suspected data breaches immediately
• Comply with all data retention and destruction requirements

4. INCIDENT REPORTING

4.1 Security Incidents
I agree to immediately report:
• Suspected unauthorized access to my account
• Loss or theft of devices containing platform access
• Suspected malware or security breaches
• Any unusual platform behavior or security warnings

4.2 Privacy Incidents
I will immediately report any suspected:
• Unauthorized disclosure of patient information
• HIPAA violations or privacy breaches
• Inappropriate access to sensitive information
• Data loss or corruption incidents

5. TRAINING AND AWARENESS

5.1 Security Training
I acknowledge that:
• I am responsible for maintaining current knowledge of cybersecurity best practices
• I will complete required security training programs
• I understand my role in maintaining platform security
• I will stay informed about emerging security threats

5.2 Phishing and Social Engineering
I understand the risks of:
• Phishing emails and malicious links
• Social engineering attacks
• Fraudulent communication attempts
• Unauthorized information requests

6. COMPLIANCE MONITORING

6.1 Security Audits
I acknowledge that:
• My platform usage may be monitored for security compliance
• Audit logs may be reviewed to investigate security incidents
• Non-compliance with security requirements may result in access restrictions
• Security policies may be updated and I am responsible for staying current

6.2 Enforcement
I understand that violation of security requirements may result in:
• Immediate suspension of platform access
• Termination of platform participation
• Notification to relevant authorities
• Legal action for damages or violations

7. ATTESTATION AND CERTIFICATION

7.1 Current Compliance
I certify that:
• My current device and network configurations meet stated security requirements
• I have implemented required security controls
• I understand and agree to comply with all stated security policies
• I will maintain ongoing compliance with security requirements

7.2 Ongoing Obligations
I agree to:
• Maintain security compliance throughout my platform participation
• Update security measures as requirements evolve
• Participate in periodic security assessments
• Report changes that may affect security compliance

CLICKWRAP ACCEPTANCE:
I acknowledge that I have read and understood this entire agreement, that I am entering into this agreement voluntarily, and that this agreement is legally binding. By clicking 'I Accept,' I agree to all terms and conditions stated above. If you do not agree to these terms, do not click the acceptance button and discontinue use of this service.`
  }
];

const CLIENT_DOCUMENTS: Document[] = [
  {
    id: 'client-master-agreement',
    title: 'Client Master Agreement',
    icon: FileText,
    required: true,
    content: `CLIENT MASTER AGREEMENT

NURSE NEST CLIENT TERMS OF SERVICE AND PLATFORM AGREEMENT

Effective Date: June 15, 2025 | Version 2.0

IMPORTANT NOTICE: THIS AGREEMENT CONTAINS BINDING ARBITRATION AND CLASS ACTION WAIVER PROVISIONS THAT AFFECT YOUR LEGAL RIGHTS. PLEASE READ CAREFULLY.

This Client Terms of Service and Platform Agreement ("Agreement") is a legally binding contract between you ("Client," "you," or "your") and Nurse Nest, LLC, a Delaware limited liability company ("Nurse Nest," "we," "us," or "our"). By creating an account, posting opportunities, or using our services, you acknowledge that you have read, understood, and agree to be bound by this Agreement.

1. PLATFORM OVERVIEW AND RELATIONSHIP

1.1 Technology Marketplace Only
Nurse Nest operates exclusively as a technology platform that facilitates connections between healthcare facilities/clients and independent healthcare professionals. WE ARE NOT A STAFFING AGENCY, HEALTHCARE PROVIDER, OR EMPLOYER. We do not employ nurses, provide healthcare services, or make hiring recommendations. Our platform serves solely as a marketplace for independent professionals to connect with potential clients.

1.2 Independent Decision Making
You acknowledge and agree that:
• All hiring, scheduling, supervision, and employment decisions are exclusively yours
• Nurse Nest does not recommend, endorse, or guarantee any healthcare professionals
• You are solely responsible for evaluating professional qualifications and suitability
• We have no involvement in or control over actual healthcare service delivery
• All professional relationships are directly between you and independent contractors

1.3 No Employment Relationships
No nurses or healthcare professionals using our platform are employees of Nurse Nest. They are independent contractors who make their own decisions about accepting or declining opportunities.

2. CLIENT RESPONSIBILITIES AND HIRING DECISIONS

2.1 Professional Evaluation
You are solely responsible for:
• Evaluating professional credentials, qualifications, and experience
• Verifying licensing and certification requirements for your specific needs
• Conducting additional background checks as required by your policies
• Determining professional competency and suitability for your environment
• Ensuring compliance with all applicable healthcare regulations
• Client warrants they maintain (a) $2M general liability, (b) employer practices liability, (c) sexual misconduct coverage

2.2 Workplace Safety and Supervision
You acknowledge that you are responsible for:
• Providing appropriate orientation and training for your facility
• Ensuring safe working conditions and proper supervision
• Maintaining compliance with all applicable safety regulations
• Providing necessary equipment, supplies, and support
• Implementing appropriate policies and procedures

2.3 Regulatory Compliance
You agree to:
• Comply with all applicable federal, state, and local healthcare regulations
• Maintain required licenses, certifications, and accreditations
• Ensure professional scope of practice compliance
• Report incidents and maintain appropriate documentation
• Satisfy all Joint Commission or other accreditation requirements

3. PLATFORM SERVICES AND LIMITATIONS

3.1 Available Services
Nurse Nest provides technology services including:
• Platform access to post opportunities and view professional profiles
• Secure messaging and communication tools
• Payment processing facilitation through third-party providers
• Basic credential verification and background check coordination
• Customer support and technical assistance

3.2 Service Limitations and Disclaimers
WE EXPLICITLY DISCLAIM ALL RESPONSIBILITY FOR:
• The quality, competency, or performance of any healthcare professionals
• Professional licensing compliance beyond basic database verification
• Patient care outcomes, medical errors, or healthcare incidents
• Workplace safety, training adequacy, or supervision quality
• Professional liability or malpractice claims
• Employment law compliance or worker classification issues
• Facility accreditation or regulatory compliance

4. PAYMENT PROCESSING AND FINANCIAL TERMS

4.1 Payment Structure
• All payments flow directly between clients and professionals through Stripe's secure payment system
• Nurse Nest facilitates payment processing but is not a party to financial transactions
• Platform fees are clearly disclosed and automatically processed
• You are responsible for all payment obligations to healthcare professionals

4.2 Payment Disputes
• Payment disputes are solely between you and the healthcare professional
• Nurse Nest is not responsible for resolving payment disagreements
• We may provide transaction records to assist in dispute resolution
• Chargebacks or payment reversals may affect platform access

4.3 Tax Obligations
You acknowledge responsibility for:
• All applicable tax reporting and withholding requirements
• Issuing appropriate tax documentation (e.g., 1099 forms) to professionals
• Compliance with federal, state, and local tax obligations
• Consulting qualified tax professionals regarding your obligations

5. BACKGROUND CHECKS AND CREDENTIAL VERIFICATION

5.1 Basic Verification Services
Nurse Nest coordinates basic background checks and credential verification through third-party providers. These services typically include:
• Criminal history searches
• Professional license verification
• OIG/GSA exclusion list checks
• Educational background verification
• Employment history verification

5.2 Verification Limitations
You understand and acknowledge that:
• Background checks may not reveal all relevant information
• Verification services have inherent limitations and delays
• Additional screening may be required for your specific needs
• You remain solely responsible for final hiring decisions
• Nurse Nest does not guarantee the accuracy or completeness of verification results

6. LIMITATION OF LIABILITY AND DISCLAIMERS

6.1 Maximum Liability Limitation
TO THE FULLEST EXTENT PERMITTED BY LAW, NURSE NEST'S TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING FROM OR RELATED TO THIS AGREEMENT OR YOUR USE OF OUR PLATFORM SHALL NOT EXCEED THE LESSER OF: (A) THE TOTAL PLATFORM FEES PAID BY YOU IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM, OR (B) ONE THOUSAND DOLLARS ($1,000).

6.2 Consequential Damages Exclusion
IN NO EVENT SHALL NURSE NEST BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES, INCLUDING BUT NOT LIMITED TO LOST PROFITS, BUSINESS INTERRUPTION, PATIENT CARE COSTS, REGULATORY FINES, OR REPUTATIONAL HARM, REGARDLESS OF THE THEORY OF LIABILITY AND EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.

7. BINDING ARBITRATION AND DISPUTE RESOLUTION

7.1 Mandatory Arbitration
ANY DISPUTE, CLAIM, OR CONTROVERSY ARISING OUT OF OR RELATING TO THIS AGREEMENT, YOUR USE OF OUR PLATFORM, OR THE RELATIONSHIP BETWEEN THE PARTIES SHALL BE RESOLVED EXCLUSIVELY THROUGH FINAL AND BINDING ARBITRATION RATHER THAN IN COURT.

7.2 Arbitration Procedures
• All arbitrations shall be conducted by a single arbitrator under the Commercial Arbitration Rules of the American Arbitration Association (AAA)
• The arbitration shall take place remotely via videoconference unless both parties agree otherwise
• Delaware law shall govern the arbitration proceedings
• Nurse Nest will bear all AAA administrative fees regardless of outcome

7.3 Class Action Waiver
YOU WAIVE ANY RIGHT TO PARTICIPATE IN A CLASS ACTION LAWSUIT OR CLASS-WIDE ARBITRATION. ALL DISPUTES MUST BE BROUGHT IN AN INDIVIDUAL CAPACITY ONLY.

CLICKWRAP ACCEPTANCE:
I acknowledge that I have read and understood this entire agreement, that I am entering into this agreement voluntarily, and that this agreement is legally binding. By clicking 'I Accept,' I agree to all terms and conditions stated above. If you do not agree to these terms, do not click the acceptance button and discontinue use of this service.`
  },
  {
    id: 'client-baa',
    title: 'Client Business Associate Agreement',
    icon: Shield,
    required: true,
    content: `EXHIBIT B - CLIENT BUSINESS ASSOCIATE AGREEMENT

NURSE NEST CLIENT HIPAA BUSINESS ASSOCIATE AGREEMENT

Effective Date: June 15, 2025

This Business Associate Agreement ("Client BAA") supplements the Client Master Agreement and governs situations where Nurse Nest may access Protected Health Information (PHI) in connection with services provided to Covered Entities.

1. APPLICABILITY AND SCOPE

1.1 Covered Entity Status
This BAA applies ONLY when PHI transmission occurs via platform messaging. Payment processing alone does not activate BAA obligations. This BAA applies only when you qualify as a "Covered Entity" under HIPAA (45 CFR § 160.103) and Nurse Nest's services involve access to your PHI.

1.2 Business Associate Functions
When applicable, Nurse Nest may function as a Business Associate by:
• Processing payment information that contains PHI
• Facilitating communications that may involve PHI
• Providing technical support that requires PHI access
• Maintaining audit logs that may contain PHI

2. PHI PROTECTION STANDARDS

2.1 Use Limitations
Nurse Nest shall use PHI only for:
• Performing specifically contracted services
• Data aggregation functions if requested
• Management and administrative activities
• Legal compliance requirements

2.2 Disclosure Restrictions
PHI disclosures are permitted only:
• As specifically authorized by you
• To subcontractors with appropriate agreements
• As required by law
• For payment processing with appropriate safeguards

3. SECURITY SAFEGUARDS

3.1 Administrative Safeguards
• Security Officer designation and responsibilities
• Workforce training and access management
• Information access management procedures
• Security awareness and training programs
• Security incident procedures
• Contingency plan development and implementation
• Regular security evaluations

3.2 Physical Safeguards
• Facility access controls and validation procedures
• Workstation use restrictions and access controls
• Device and media controls for PHI storage

3.3 Technical Safeguards
• Access control systems with unique user identification
• Audit controls and integrity measures
• Person or entity authentication procedures
• Transmission security for PHI communications

4. BREACH NOTIFICATION AND INCIDENT RESPONSE

4.1 Incident Detection
Nurse Nest shall implement systems to detect:
• Unauthorized PHI access attempts
• System vulnerabilities and security weaknesses
• Potential data integrity issues
• Suspicious user activity patterns

4.2 Notification Requirements
Upon discovering a potential breach, Nurse Nest shall:
• Notify you within 24 hours of discovery
• Provide preliminary breach assessment
• Begin immediate containment measures
• Conduct thorough investigation and documentation

4.3 Breach Assessment Criteria
Breach assessments shall consider:
• Nature and extent of PHI involved
• Unauthorized persons who accessed PHI
• Whether PHI was actually acquired or viewed
• Extent to which risk has been mitigated

5. SUBCONTRACTOR MANAGEMENT

5.1 Business Associate Agreements
Before engaging subcontractors with PHI access, Nurse Nest shall:
• Execute compliant Business Associate Agreements
• Ensure equivalent protection standards
• Establish monitoring and oversight procedures
• Document compliance verification activities

5.2 Ongoing Oversight
Nurse Nest shall:
• Monitor subcontractor compliance regularly
• Conduct periodic security assessments
• Address compliance deficiencies promptly
• Maintain documentation of oversight activities

6. INDIVIDUAL RIGHTS SUPPORT

6.1 Access Requests
When you receive individual access requests, Nurse Nest shall:
• Provide relevant PHI within 30 days
• Ensure information is in accessible format
• Document all access request activities
• Cooperate with any access disputes

6.2 Amendment Support
For PHI amendment requests, Nurse Nest shall:
• Implement approved amendments within 60 days
• Update all relevant systems and records
• Notify subcontractors of required changes
• Maintain amendment documentation

7. TERMINATION PROCEDURES

7.1 PHI Return Process
Upon termination, Nurse Nest shall:
• Inventory all PHI in its possession
• Return PHI in agreed-upon format within 30 days
• Securely destroy PHI from all systems
• Provide written certification of return/destruction

7.2 Impracticability Provisions
If return/destruction is impracticable, Nurse Nest shall:
• Document specific impracticability reasons
• Implement additional protective measures
• Limit future use to legally required purposes
• Establish destruction timeline when feasible

This Client BAA supplements the Client Master Agreement and controls with respect to PHI handling obligations.

CLICKWRAP ACCEPTANCE:
I acknowledge that I have read and understood this entire agreement, that I am entering into this agreement voluntarily, and that this agreement is legally binding. By clicking 'I Accept,' I agree to all terms and conditions stated above. If you do not agree to these terms, do not click the acceptance button and discontinue use of this service.`
  },
  {
    id: 'data-security-addendum',
    title: 'Data Security Addendum',
    icon: Lock,
    required: true,
    content: `DATA SECURITY ADDENDUM

NURSE NEST DATA SECURITY AND COMPLIANCE ADDENDUM

Effective Date: June 15, 2025

This Data Security Addendum ("Security Addendum") supplements the Client Master Agreement and establishes additional security requirements for data protection and regulatory compliance.

1. SECURITY FRAMEWORK REQUIREMENTS

1.1 Baseline Security Standards
Nurse Nest maintains security controls consistent with:
• NIST Cybersecurity Framework Core Functions
• HIPAA Security Rule requirements (45 CFR § 164.308-318)
• SOC 2 Type II audit standards
• ISO 27001 information security management principles

1.2 Third-Party Certifications
Nurse Nest shall maintain current certifications including:
• Annual SOC 2 Type II audits
• HIPAA compliance assessments
• Penetration testing by qualified third parties
• Vulnerability scanning and remediation programs

2. DATA CLASSIFICATION AND HANDLING

2.1 Data Categories
Information is classified as:
• Public: Information intended for public disclosure
• Internal: Information for internal business use
• Confidential: Sensitive business information requiring protection
• Restricted: Highly sensitive information requiring maximum protection (including PHI)

2.2 Handling Requirements
Each data category requires specific:
• Access control mechanisms
• Encryption standards (AES-256 minimum)
• Retention and disposal procedures
• Transmission security protocols

3. ACCESS CONTROLS AND AUTHENTICATION

3.1 User Access Management
• Role-based access control (RBAC) implementation
• Principle of least privilege enforcement
• Regular access reviews and recertification
• Automated provisioning and deprovisioning

3.2 Authentication Requirements
• Multi-factor authentication for all system access
• Strong password policies and management
• Session management and timeout controls
• Account lockout and monitoring procedures

4. NETWORK AND SYSTEM SECURITY

4.1 Network Protection
• Firewall configuration and management
• Network segmentation and isolation
• Intrusion detection and prevention systems
• Regular vulnerability scanning and patching

4.2 System Hardening
• Operating system security configuration
• Application security testing and remediation
• Database security and encryption
• Backup and recovery procedures

5. INCIDENT RESPONSE AND MONITORING

5.1 Security Monitoring
• 24/7 security operations center (SOC) monitoring
• Automated threat detection and response
• Log aggregation and analysis
• Security information and event management (SIEM)

5.2 Incident Response Process
• Immediate containment and investigation procedures
• Client notification within required timeframes
• Forensic analysis and evidence preservation
• Corrective action implementation and verification

6. VENDOR AND SUPPLY CHAIN SECURITY

6.1 Third-Party Risk Management
• Security assessments for all vendors with data access
• Contractual security requirements and monitoring
• Regular vendor security reviews and audits
• Supply chain risk assessment and mitigation

6.2 Cloud Service Provider Requirements
• SOC 2 Type II certification requirement
• Data residency and sovereignty controls
• Encryption in transit and at rest
• Backup and disaster recovery capabilities

7. COMPLIANCE AND AUDIT REQUIREMENTS

7.1 Regulatory Compliance
Ongoing compliance with:
• HIPAA Privacy and Security Rules
• State data protection laws (CCPA, SHIELD Act, etc.)
• Federal Trade Commission requirements
• Industry-specific regulations as applicable

7.2 Audit and Assessment
• Annual third-party security assessments
• Quarterly internal compliance reviews
• Client audit rights and cooperation
• Continuous monitoring and improvement

8. DATA BREACH NOTIFICATION

8.1 Detection and Assessment
• Automated breach detection capabilities
• Risk assessment and classification procedures
• Documentation and evidence preservation
• Impact analysis and mitigation planning

8.2 Notification Procedures
• Client notification within 24 hours of discovery
• Regulatory notification as required by law
• Individual notification coordination with clients
• Media response and communication management

9. BUSINESS CONTINUITY AND DISASTER RECOVERY

9.1 Continuity Planning
• Business impact analysis and risk assessment
• Recovery time and point objectives
• Alternative processing capabilities
• Regular testing and plan updates

9.2 Data Backup and Recovery
• Automated daily backup procedures
• Geographically distributed backup storage
• Regular recovery testing and validation
• Data integrity verification processes

10. SECURITY TRAINING AND AWARENESS

10.1 Personnel Security
• Background check requirements for security-sensitive roles
• Security awareness training for all personnel
• Specialized training for security and IT staff
• Regular security updates and communications

10.2 Client Security Support
• Security best practices guidance
• Incident response coordination and support
• Security tool recommendations and implementation
• Ongoing security consultation and advice

This Security Addendum establishes minimum security requirements and may be supplemented by additional client-specific security requirements as agreed in writing.

CLICKWRAP ACCEPTANCE:
I acknowledge that I have read and understood this entire agreement, that I am entering into this agreement voluntarily, and that this agreement is legally binding. By clicking 'I Accept,' I agree to all terms and conditions stated above. If you do not agree to these terms, do not click the acceptance button and discontinue use of this service.`
  }
];

export default function ClickwrapAgreement({ userType, onAllAccepted }: ClickwrapAgreementProps) {
  const documents = userType === 'nurse' ? NURSE_DOCUMENTS : CLIENT_DOCUMENTS;
  const [scrollStates, setScrollStates] = useState<Record<string, boolean>>({});
  const [acceptanceStates, setAcceptanceStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Initialize scroll states to false
    const initialScrollStates: Record<string, boolean> = {};
    documents.forEach(doc => {
      initialScrollStates[doc.id] = false;
    });
    setScrollStates(initialScrollStates);
  }, [documents]);

  useEffect(() => {
    // Check if all required documents are accepted
    const allRequired = documents.filter(doc => doc.required);
    const allAccepted = allRequired.every(doc => acceptanceStates[doc.id]);
    onAllAccepted(allAccepted);
  }, [acceptanceStates, documents, onAllAccepted]);

  const handleScroll = (docId: string, event: React.UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    const scrollTop = target.scrollTop;
    const scrollHeight = target.scrollHeight;
    const clientHeight = target.clientHeight;
    
    // Check if scrolled to bottom (with small tolerance)
    const isScrolledToBottom = scrollTop + clientHeight >= scrollHeight - 5;
    
    if (isScrolledToBottom && !scrollStates[docId]) {
      setScrollStates(prev => ({
        ...prev,
        [docId]: true
      }));
    }
  };

  const handleAcceptanceChange = (docId: string, checked: boolean) => {
    setAcceptanceStates(prev => ({
      ...prev,
      [docId]: checked
    }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Legal Agreements</h2>
        <p className="text-gray-600">
          Please review and accept all required agreements to complete your registration.
        </p>
      </div>

      {documents.map((document) => {
        const Icon = document.icon;
        const isScrolledToBottom = scrollStates[document.id];
        const isAccepted = acceptanceStates[document.id];
        const canAccept = isScrolledToBottom || !document.required;

        return (
          <Card key={document.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6 border-b bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${isAccepted ? 'bg-green-100' : 'bg-blue-100'}`}>
                    {isAccepted ? (
                      <Check className="h-5 w-5 text-green-600" />
                    ) : (
                      <Icon className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{document.title}</h3>
                    {document.required && (
                      <p className="text-sm text-red-600">Required</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="relative">
                <ScrollArea 
                  className="h-64 p-6" 
                  onScrollCapture={(e) => handleScroll(document.id, e)}
                >
                  <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                    {document.content}
                  </div>
                </ScrollArea>
                
                {!isScrolledToBottom && document.required && (
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent flex items-end justify-center pb-2">
                    <p className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full shadow-sm">
                      Continue scrolling to read full document...
                    </p>
                  </div>
                )}
              </div>

              <div className="p-6 border-t bg-gray-50">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id={`accept-${document.id}`}
                    checked={isAccepted}
                    disabled={!canAccept}
                    onCheckedChange={(checked) => 
                      handleAcceptanceChange(document.id, checked as boolean)
                    }
                    className="data-[state=disabled]:opacity-50"
                  />
                  <Label 
                    htmlFor={`accept-${document.id}`}
                    className={`text-sm ${!canAccept ? 'text-gray-400' : 'text-gray-700'} ${
                      !canAccept ? 'cursor-not-allowed' : 'cursor-pointer'
                    }`}
                  >
                    I have read and agree to the {document.title}
                    {!isScrolledToBottom && document.required && (
                      <span className="text-gray-500 ml-1">
                        (scroll to bottom to enable)
                      </span>
                    )}
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start space-x-3">
          <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Final Acceptance</h4>
            <p className="text-sm text-blue-700">
              By proceeding, you acknowledge that you have read, understood, and agree to be legally bound by all the terms and conditions set forth in the documents above. If you do not agree to these terms, do not proceed with account creation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}