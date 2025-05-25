// src/supabase/api/contractTemplateService.ts
import { supabase } from '@/integrations/supabase/client';
import { 
  createContract as baseCreateContract, 
  generateContractTermsTemplate as baseGenerateTerms 
} from './contractService';

/**
 * Care type specific contract templates
 */
export type CareType = 
  | 'Adult Care' 
  | 'Pediatric' 
  | 'Elderly Care' 
  | 'Postpartum' 
  | 'Newborn Care'
  | 'Post-Surgery'
  | 'Palliative Care'
  | 'Mental Health'
  | 'Rehabilitation'
  | 'General';

/**
 * Contract template data structure
 */
export interface ContractTemplate {
  careType: CareType;
  title: string;
  baseTerms: string;
  specificClauses: string[];
  requiredInsurance: string[];
  specialRequirements: string[];
  rateGuidelines: {
    minimumRate: number;
    averageRate: number;
    premiumRate: number;
  };
}

/**
 * Enhanced contract generation with care-specific terms
 */
export function generateEnhancedContractTerms(
  jobDetails: {
    title?: string;
    careType: string;
    duration: string;
    preferredTime: string;
    benefits?: string;
    location?: string;
    specialRequirements?: string[];
  },
  nurseDetails: {
    firstName: string;
    lastName: string;
    licenseNumber?: string;
    specializations?: string[];
  },
  clientDetails: {
    firstName: string;
    lastName: string;
    clientType?: 'individual' | 'family';
    emergencyContact?: string;
  },
  contractOptions?: {
    includeTerminationClause?: boolean;
    includeConfidentialityClause?: boolean;
    includeNonCompeteClause?: boolean;
    customClauses?: string[];
  }
): string {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Get care-specific template
  const template = getContractTemplate(jobDetails.careType as CareType);
  
  // Generate contract ID
  const contractId = `NN-${Date.now().toString().slice(-6)}`;

  let contractTerms = `
# INDEPENDENT CONTRACTOR AGREEMENT
**Contract ID:** ${contractId}
**Agreement Date:** ${formattedDate}

## PARTIES

**CLIENT:** ${clientDetails.firstName} ${clientDetails.lastName} ("Client")
${clientDetails.clientType ? `**Client Type:** ${clientDetails.clientType.charAt(0).toUpperCase() + clientDetails.clientType.slice(1)}` : ''}

**NURSE:** ${nurseDetails.firstName} ${nurseDetails.lastName} ("Contractor")
${nurseDetails.licenseNumber ? `**License Number:** ${nurseDetails.licenseNumber}` : ''}
${nurseDetails.specializations?.length ? `**Specializations:** ${nurseDetails.specializations.join(', ')}` : ''}

---

## 1. SERVICES TO BE PROVIDED

**Care Type:** ${jobDetails.careType}
**Duration:** ${jobDetails.duration}
**Schedule:** ${jobDetails.preferredTime}
${jobDetails.location ? `**Location:** ${jobDetails.location}` : ''}

### Scope of Services:
${template.baseTerms}

### Specific Care Requirements:
${template.specificClauses.map(clause => `• ${clause}`).join('\n')}

${jobDetails.specialRequirements?.length ? `
### Additional Requirements:
${jobDetails.specialRequirements.map(req => `• ${req}`).join('\n')}
` : ''}

---

## 2. INDEPENDENT CONTRACTOR STATUS

The parties acknowledge and agree that:

a) Contractor is an independent contractor and not an employee, agent, or partner of Client
b) Contractor has the right to control and determine the methods and means of performing the services
c) Contractor is responsible for providing their own tools, equipment, and supplies unless otherwise specified
d) Contractor is responsible for all federal, state, and local taxes
e) Contractor is not entitled to employee benefits

---

## 3. COMPENSATION AND PAYMENT

### Rate Structure:
${template.rateGuidelines ? `
• Minimum Rate: $${template.rateGuidelines.minimumRate}/hour
• Average Market Rate: $${template.rateGuidelines.averageRate}/hour
• Premium Rate: $${template.rateGuidelines.premiumRate}/hour
` : ''}

### Payment Terms:
• Payment will be processed through the Nurse Nest platform
• 85% of the agreed hourly rate goes to the Contractor
• 15% platform fee is retained by Nurse Nest for services including:
  - Payment processing and security
  - Customer support and dispute resolution
  - Platform maintenance and development
  - Insurance and liability coverage

• Payments are processed weekly upon timecard approval
• All payments are subject to applicable taxes and withholdings

${jobDetails.benefits ? `
### Additional Benefits:
${jobDetails.benefits}
` : ''}

---

## 4. PROFESSIONAL REQUIREMENTS

### Insurance Requirements:
${template.requiredInsurance.map(insurance => `• ${insurance}`).join('\n')}

### Licensing and Certification:
• Contractor must maintain current, valid nursing license
• All certifications must be kept current throughout the contract period
• Contractor must provide proof of continuing education as required by state law

### Special Requirements for ${jobDetails.careType}:
${template.specialRequirements.map(req => `• ${req}`).join('\n')}

---

## 5. CONFIDENTIALITY AND HIPAA COMPLIANCE

Contractor acknowledges and agrees to:

a) Maintain strict confidentiality of all patient information and family matters
b) Comply with all HIPAA regulations and requirements
c) Not disclose any information about the Client or care recipient to third parties
d) Return all confidential information upon termination of this agreement
e) Report any suspected breaches of confidentiality immediately

**HIPAA Authorization:** This agreement serves as authorization for the sharing of protected health information necessary for the provision of care services.

---

## 6. DUTIES AND RESPONSIBILITIES

### Contractor's Responsibilities:
• Provide professional nursing care in accordance with accepted standards
• Maintain accurate records and documentation
• Communicate effectively with Client and family members
• Report any changes in condition or concerns immediately
• Follow all care plans and medical orders
• Maintain professional appearance and conduct
• Arrive punctually for all scheduled shifts
• Provide adequate notice for any schedule changes

### Client's Responsibilities:
• Provide safe working environment
• Supply necessary medical equipment and supplies (unless otherwise agreed)
• Provide accurate medical history and current medications
• Communicate care preferences and requirements clearly
• Ensure payment for services as agreed
• Treat Contractor with respect and professionalism

---

## 7. TERMINATION

${contractOptions?.includeTerminationClause !== false ? `
This agreement may be terminated:

a) By either party with 14 days written notice for convenience
b) By either party immediately for cause, including but not limited to:
   - Breach of contract terms
   - Unprofessional conduct
   - Failure to maintain required licenses or insurance
   - Safety concerns
   - Non-payment (Client) or no-show (Contractor)

### Notice Requirements:
• All termination notices must be provided through the Nurse Nest platform
• Final payment will be processed within 7 days of termination
• All confidential information must be returned immediately upon termination
` : ''}

---

## 8. LIABILITY AND INDEMNIFICATION

### Professional Liability:
• Contractor maintains professional liability insurance as specified above
• Contractor is responsible for their own professional actions and decisions
• Client agrees that Nurse Nest is not liable for Contractor's professional services

### General Liability:
• Each party is responsible for their own negligent acts
• Neither party shall be liable for indirect, incidental, or consequential damages
• Total liability under this agreement shall not exceed the total contract value

---

## 9. DISPUTE RESOLUTION

### Process:
1. **Direct Communication:** Parties agree to first attempt resolution through direct communication
2. **Platform Mediation:** If direct resolution fails, disputes will be mediated through Nurse Nest's dispute resolution process
3. **Arbitration:** If mediation fails, disputes will be resolved through binding arbitration in accordance with the rules of the American Arbitration Association

### Governing Law:
This agreement shall be governed by the laws of the state where services are provided, without regard to conflict of law principles.

---

## 10. EMERGENCY PROCEDURES

### Emergency Contacts:
${clientDetails.emergencyContact ? `**Client Emergency Contact:** ${clientDetails.emergencyContact}` : '**Client Emergency Contact:** To be provided'}
**Nurse Nest 24/7 Support:** 1-800-NURSE-NEST

### Emergency Protocols:
• In case of medical emergency, call 911 immediately
• Notify Client and/or emergency contact as soon as safely possible
• Contact Nurse Nest support for any platform-related emergencies
• Document all emergency incidents thoroughly

---

## 11. QUALITY ASSURANCE

### Performance Standards:
• Contractor agrees to maintain the highest standards of professional care
• Client may provide feedback through the Nurse Nest platform
• Nurse Nest may conduct quality assurance reviews
• Both parties commit to continuous improvement

### Documentation:
• Contractor will maintain accurate records of all care provided
• Client will have access to care summaries through the platform
• All documentation must comply with professional and legal standards

---

${contractOptions?.includeNonCompeteClause ? `
## 12. NON-COMPETE CLAUSE

For a period of 6 months following termination of this agreement, Contractor agrees not to:
• Directly contract with Client outside of the Nurse Nest platform for similar services
• Solicit other Nurse Nest clients for private arrangements
• Share Nurse Nest client information with competing platforms

This clause is designed to protect the integrity of the Nurse Nest platform while allowing reasonable career flexibility for contractors.

---
` : ''}

${contractOptions?.customClauses?.length ? `
## 13. ADDITIONAL TERMS

${contractOptions.customClauses.map((clause, index) => `${index + 1}. ${clause}`).join('\n')}

---
` : ''}

## 14. ENTIRE AGREEMENT

This agreement constitutes the entire understanding between the parties and supersedes all prior negotiations, representations, or agreements relating to the subject matter. This agreement may only be modified in writing through the Nurse Nest platform.

### Electronic Signatures:
By accepting this contract through the Nurse Nest platform, both parties acknowledge that:
• Electronic signatures are legally binding
• They have read and understood all terms
• They agree to be bound by this agreement
• They have the authority to enter into this contract

### Platform Integration:
This contract is facilitated through Nurse Nest LLC and is subject to the Nurse Nest Terms of Service and Privacy Policy, which are incorporated herein by reference.

---

**Contract Generated:** ${formattedDate}
**Platform:** Nurse Nest Professional Care Services
**Contract ID:** ${contractId}

*This contract has been generated using Nurse Nest's secure platform. Both parties will receive a copy upon execution.*
`;

  return contractTerms;
}

/**
 * Get care-specific contract template
 */
export function getContractTemplate(careType: CareType): ContractTemplate {
  const templates: Record<CareType, ContractTemplate> = {
    'Adult Care': {
      careType: 'Adult Care',
      title: 'Adult Care Services Contract',
      baseTerms: 'Contractor will provide professional nursing care services to an adult care recipient, including but not limited to medication management, vital sign monitoring, personal care assistance, and health status assessment.',
      specificClauses: [
        'Monitor and document vital signs as required',
        'Assist with activities of daily living as needed',
        'Administer medications per physician orders',
        'Provide wound care and dressing changes as required',
        'Maintain communication with healthcare providers',
        'Ensure safety and fall prevention measures'
      ],
      requiredInsurance: [
        'Professional Liability Insurance (minimum $1M per occurrence)',
        'General Liability Insurance (minimum $500K)',
        'Malpractice Insurance covering nursing services'
      ],
      specialRequirements: [
        'Current RN or LPN license in good standing',
        'CPR certification required',
        'Adult care experience preferred',
        'Ability to lift up to 50 pounds'
      ],
      rateGuidelines: {
        minimumRate: 35,
        averageRate: 45,
        premiumRate: 60
      }
    },

    'Pediatric': {
      careType: 'Pediatric',
      title: 'Pediatric Care Services Contract',
      baseTerms: 'Contractor will provide specialized pediatric nursing care services, including age-appropriate care, family education, and developmental support for pediatric patients.',
      specificClauses: [
        'Provide age-appropriate nursing care',
        'Monitor growth and development milestones',
        'Administer pediatric medications with appropriate dosing',
        'Educate family members on care procedures',
        'Maintain pediatric emergency protocols',
        'Document care using pediatric-specific assessment tools'
      ],
      requiredInsurance: [
        'Professional Liability Insurance with pediatric coverage (minimum $1M)',
        'General Liability Insurance (minimum $500K)',
        'Specialized pediatric malpractice coverage'
      ],
      specialRequirements: [
        'Current RN license with pediatric certification preferred',
        'Pediatric Advanced Life Support (PALS) certification',
        'Minimum 2 years pediatric nursing experience',
        'Background check and child abuse clearances',
        'Pediatric medication administration certification'
      ],
      rateGuidelines: {
        minimumRate: 40,
        averageRate: 55,
        premiumRate: 75
      }
    },

    'Elderly Care': {
      careType: 'Elderly Care',
      title: 'Geriatric Care Services Contract',
      baseTerms: 'Contractor will provide specialized geriatric nursing care services, focusing on age-related health issues, chronic disease management, and maintaining quality of life for elderly patients.',
      specificClauses: [
        'Provide geriatric-focused nursing assessments',
        'Manage multiple chronic conditions',
        'Monitor for age-related complications',
        'Provide medication reconciliation and management',
        'Assess cognitive function and safety',
        'Coordinate with geriatric healthcare team'
      ],
      requiredInsurance: [
        'Professional Liability Insurance (minimum $1M)',
        'General Liability Insurance (minimum $500K)',
        'Elder care specific malpractice coverage'
      ],
      specialRequirements: [
        'Current RN license with geriatric experience',
        'Gerontology certification preferred',
        'Dementia care training required',
        'Fall prevention certification',
        'End-of-life care training'
      ],
      rateGuidelines: {
        minimumRate: 38,
        averageRate: 48,
        premiumRate: 65
      }
    },

    'Postpartum': {
      careType: 'Postpartum',
      title: 'Postpartum Care Services Contract',
      baseTerms: 'Contractor will provide specialized postpartum nursing care for new mothers and newborns, including breastfeeding support, recovery monitoring, and family education.',
      specificClauses: [
        'Provide postpartum recovery assessment and care',
        'Support breastfeeding and feeding education',
        'Monitor maternal healing and complications',
        'Provide newborn care education',
        'Assess postpartum mental health',
        'Educate on infant safety and care'
      ],
      requiredInsurance: [
        'Professional Liability Insurance with obstetric coverage (minimum $1M)',
        'General Liability Insurance (minimum $500K)',
        'Maternal-newborn specialized coverage'
      ],
      specialRequirements: [
        'Current RN license with obstetric/postpartum experience',
        'Lactation consultant certification preferred',
        'Newborn resuscitation certification',
        'Postpartum depression screening training',
        'Minimum 2 years maternal-child experience'
      ],
      rateGuidelines: {
        minimumRate: 45,
        averageRate: 60,
        premiumRate: 80
      }
    },

    'Newborn Care': {
      careType: 'Newborn Care',
      title: 'Newborn Care Specialist Contract',
      baseTerms: 'Contractor will provide specialized newborn care services, including feeding support, sleep guidance, and newborn health monitoring during the critical first months.',
      specificClauses: [
        'Provide 24/7 newborn care as scheduled',
        'Support feeding schedules and techniques',
        'Monitor newborn health and development',
        'Educate parents on newborn care',
        'Maintain newborn sleep safety standards',
        'Document feeding, sleeping, and elimination patterns'
      ],
      requiredInsurance: [
        'Professional Liability Insurance with newborn coverage (minimum $1M)',
        'General Liability Insurance (minimum $500K)',
        'Newborn care specialist coverage'
      ],
      specialRequirements: [
        'Current RN license or Newborn Care Specialist certification',
        'Neonatal resuscitation certification',
        'Newborn care specialist training',
        'Infant sleep safety certification',
        'Minimum 3 years newborn care experience'
      ],
      rateGuidelines: {
        minimumRate: 50,
        averageRate: 65,
        premiumRate: 90
      }
    },

    'Post-Surgery': {
      careType: 'Post-Surgery',
      title: 'Post-Surgical Care Services Contract',
      baseTerms: 'Contractor will provide specialized post-surgical nursing care, including wound management, pain assessment, medication administration, and recovery monitoring.',
      specificClauses: [
        'Provide post-operative assessment and monitoring',
        'Manage surgical wounds and dressings',
        'Monitor for post-surgical complications',
        'Administer pain medications and assess effectiveness',
        'Assist with mobility and rehabilitation',
        'Educate on post-surgical care and restrictions'
      ],
      requiredInsurance: [
        'Professional Liability Insurance (minimum $1M)',
        'General Liability Insurance (minimum $500K)',
        'Surgical nursing malpractice coverage'
      ],
      specialRequirements: [
        'Current RN license with surgical experience',
        'Post-surgical care certification preferred',
        'Wound care certification',
        'Pain management training',
        'Minimum 3 years surgical nursing experience'
      ],
      rateGuidelines: {
        minimumRate: 42,
        averageRate: 55,
        premiumRate: 75
      }
    },

    'Palliative Care': {
      careType: 'Palliative Care',
      title: 'Palliative Care Services Contract',
      baseTerms: 'Contractor will provide compassionate palliative care services focused on comfort, pain management, and quality of life for patients with serious illnesses.',
      specificClauses: [
        'Provide symptom management and comfort care',
        'Administer pain medications and assess comfort levels',
        'Support patient and family emotional needs',
        'Coordinate with palliative care team',
        'Provide end-of-life care as appropriate',
        'Maintain dignity and respect throughout care'
      ],
      requiredInsurance: [
        'Professional Liability Insurance with hospice/palliative coverage (minimum $1M)',
        'General Liability Insurance (minimum $500K)',
        'End-of-life care specialized coverage'
      ],
      specialRequirements: [
        'Current RN license with palliative care experience',
        'Hospice/palliative care certification preferred',
        'End-of-life care training required',
        'Grief and bereavement training',
        'Minimum 2 years hospice/palliative experience'
      ],
      rateGuidelines: {
        minimumRate: 45,
        averageRate: 58,
        premiumRate: 78
      }
    },

    'Mental Health': {
      careType: 'Mental Health',
      title: 'Mental Health Nursing Services Contract',
      baseTerms: 'Contractor will provide specialized psychiatric nursing care, including mental health assessment, medication monitoring, and therapeutic support.',
      specificClauses: [
        'Provide psychiatric nursing assessments',
        'Monitor psychiatric medications and side effects',
        'Implement safety protocols for mental health patients',
        'Provide therapeutic communication and support',
        'Assess suicide risk and implement safety measures',
        'Coordinate with mental health treatment team'
      ],
      requiredInsurance: [
        'Professional Liability Insurance with psychiatric coverage (minimum $1M)',
        'General Liability Insurance (minimum $500K)',
        'Mental health professional coverage'
      ],
      specialRequirements: [
        'Current RN license with psychiatric experience',
        'Psychiatric nursing certification preferred',
        'Mental health first aid certification',
        'Suicide prevention training',
        'Minimum 2 years psychiatric nursing experience'
      ],
      rateGuidelines: {
        minimumRate: 40,
        averageRate: 52,
        premiumRate: 70
      }
    },

    'Rehabilitation': {
      careType: 'Rehabilitation',
      title: 'Rehabilitation Nursing Services Contract',
      baseTerms: 'Contractor will provide specialized rehabilitation nursing care to support patient recovery and maximize functional independence.',
      specificClauses: [
        'Provide rehabilitation-focused nursing care',
        'Assist with physical therapy and mobility exercises',
        'Monitor progress toward rehabilitation goals',
        'Educate patient and family on recovery process',
        'Coordinate with rehabilitation team members',
        'Assess and prevent complications during recovery'
      ],
      requiredInsurance: [
        'Professional Liability Insurance (minimum $1M)',
        'General Liability Insurance (minimum $500K)',
        'Rehabilitation nursing coverage'
      ],
      specialRequirements: [
        'Current RN license with rehabilitation experience',
        'Rehabilitation nursing certification preferred',
        'Physical assessment skills',
        'Mobility and transfer training',
        'Minimum 2 years rehabilitation experience'
      ],
      rateGuidelines: {
        minimumRate: 38,
        averageRate: 50,
        premiumRate: 68
      }
    },

    'General': {
      careType: 'General',
      title: 'General Nursing Services Contract',
      baseTerms: 'Contractor will provide general nursing care services as required, including basic nursing assessments, medication administration, and health monitoring.',
      specificClauses: [
        'Provide general nursing assessments and care',
        'Administer medications as prescribed',
        'Monitor vital signs and health status',
        'Provide basic personal care assistance',
        'Maintain accurate nursing documentation',
        'Communicate with healthcare providers as needed'
      ],
      requiredInsurance: [
        'Professional Liability Insurance (minimum $1M)',
        'General Liability Insurance (minimum $500K)',
        'General nursing malpractice coverage'
      ],
      specialRequirements: [
        'Current RN or LPN license in good standing',
        'CPR certification required',
        'Basic nursing skills assessment',
        'Professional communication skills'
      ],
      rateGuidelines: {
        minimumRate: 35,
        averageRate: 45,
        premiumRate: 60
      }
    }
  };

  return templates[careType] || templates['General'];
}

/**
 * Get available care types
 */
export function getAvailableCareTypes(): CareType[] {
  return [
    'Adult Care',
    'Pediatric',
    'Elderly Care',
    'Postpartum',
    'Newborn Care',
    'Post-Surgery',
    'Palliative Care',
    'Mental Health',
    'Rehabilitation',
    'General'
  ];
}

/**
 * Validate contract requirements for specific care type
 */
export function validateContractRequirements(
  careType: CareType,
  nurseQualifications: {
    licenseType?: string;
    certifications?: string[];
    experience?: number;
    specializations?: string[];
  }
): {
  isValid: boolean;
  missingRequirements: string[];
  warnings: string[];
} {
  const template = getContractTemplate(careType);
  const missingRequirements: string[] = [];
  const warnings: string[] = [];

  // Check basic license requirement
  if (!nurseQualifications.licenseType) {
    missingRequirements.push('Valid nursing license required');
  }

  // Care-specific validations
  switch (careType) {
    case 'Pediatric':
      if (!nurseQualifications.certifications?.includes('PALS')) {
        warnings.push('PALS certification strongly recommended for pediatric care');
      }
      if ((nurseQualifications.experience || 0) < 2) {
        warnings.push('Minimum 2 years pediatric experience recommended');
      }
      break;

    case 'Newborn Care':
      if (!nurseQualifications.certifications?.includes('NRP')) {
        missingRequirements.push('Neonatal Resuscitation Program (NRP) certification required');
      }
      if ((nurseQualifications.experience || 0) < 3) {
        warnings.push('Minimum 3 years newborn care experience recommended');
      }
      break;

    case 'Palliative Care':
      if ((nurseQualifications.experience || 0) < 2) {
        warnings.push('Minimum 2 years hospice/palliative care experience recommended');
      }
      break;

    // Add more care-specific validations as needed
  }

  return {
    isValid: missingRequirements.length === 0,
    missingRequirements,
    warnings
  };
}