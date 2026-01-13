import type { 
  PersonalInfo, 
  DisabilityApplication, 
  Consent, 
  ApplicationTracking, 
  CRAVerification,
  BCServicesCard 
} from '../types';

// Amina's User Profile - Based on PDF context
// BC Services Card data includes all verified personal information
export const aminaUser: BCServicesCard = {
  userId: 'BCSC-AMI-2025-001',
  verified: true,
  firstName: 'Amina',
  lastName: 'Ahmed',
  dateOfBirth: '1985-03-15',
  sin: '123-456-789',
  phoneNumber: '250-555-0123',
  email: 'amina.ahmed@example.com',
  address: {
    streetAddress: '123 Government Street',
    city: 'Victoria',
    province: 'BC',
    postalCode: 'V8W 1X4'
  }
};

export const aminaPersonalInfo: PersonalInfo = {
  firstName: 'Amina',
  lastName: 'Ahmed',
  sin: '123-456-789', // Mock SIN
  dateOfBirth: '1985-03-15',
  phoneNumber: '250-555-0123',
  email: 'amina.ahmed@example.com',
  address: {
    streetAddress: '123 Government Street',
    city: 'Victoria',
    province: 'BC',
    postalCode: 'V8W 1X4'
  }
};

export const aminaDisabilityApplication: DisabilityApplication = {
  applicationType: 'disability',
  hasPhysicalDisability: false,
  hasMentalHealthCondition: true,
  requiresAssistance: true,
  disabilityDescription: 'Living with chronic anxiety and depression that affects daily functioning and ability to maintain consistent employment.',
  medicalDocumentation: true
};

export const aminaConsent: Consent = {
  consentId: 'CONSENT-AMI-001',
  craDataAccess: true,
  electronicSignature: 'Amina Ahmed',
  timestamp: new Date().toISOString(),
  ipAddress: '192.168.1.100',
  consentText: 'I consent to the Ministry of Citizens\' Services accessing my income information from the Canada Revenue Agency (CRA) for the purpose of verifying my eligibility for disability benefits.'
};

export const aminaTracking: ApplicationTracking = {
  applicationId: 'APP-2025-AMI-001',
  checkId: 'CHK-2025-123456',
  packId: 'PACK-2025-789012',
  status: 'draft',
  submittedAt: new Date().toISOString()
};

export const aminaCRAVerification: CRAVerification = {
  source: 'CRA',
  status: 'verified',
  taxYear: 2024,
  totalIncome: 28500, // Below disability benefit threshold
  employmentIncome: 28500,
  verifiedAt: new Date().toISOString(),
  factors: {
    incomeEligibility: true,
    thresholdMet: true,
    disabilityEligibility: true,
    additionalFactors: [
      'Income below provincial threshold',
      'No other government benefits currently received',
      'Medical documentation provided'
    ]
  }
};

// Complete mock data for Amina's application
export const aminaCompleteApplication = {
  user: aminaUser,
  personalInfo: aminaPersonalInfo,
  disabilityApplication: aminaDisabilityApplication,
  consent: aminaConsent,
  tracking: aminaTracking,
  craVerification: aminaCRAVerification
};

// Additional mock users for testing different scenarios
export const mockUsers = {
  amina: aminaCompleteApplication,
  // Can add more users later
};

export default aminaCompleteApplication;
