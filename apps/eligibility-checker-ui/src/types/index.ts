// User and Authentication Types
export interface BCServicesCard {
  userId: string;
  verified: boolean;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  sin: string;
  phoneNumber: string;
  email: string;
  address: {
    streetAddress: string;
    city: string;
    province: string;
    postalCode: string;
  };
}

export interface UserSession {
  sessionToken: string;
  userId: string;
  expiresAt: string;
}

// Personal Information
export interface PersonalInfo {
  firstName: string;
  lastName: string;
  sin: string;
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
  address: Address;
}

export interface Address {
  streetAddress: string;
  city: string;
  province: string;
  postalCode: string;
}

// Application Types
export interface DisabilityApplication {
  applicationType: 'disability' | 'income-assistance';
  hasPhysicalDisability: boolean;
  hasMentalHealthCondition: boolean;
  requiresAssistance: boolean;
  disabilityDescription: string;
  medicalDocumentation: boolean;
}

// Consent Management
export interface Consent {
  consentId: string;
  craDataAccess: boolean;
  electronicSignature: string;
  timestamp: string;
  ipAddress: string;
  consentText: string;
}

// Application Tracking
export interface ApplicationTracking {
  applicationId: string;
  checkId: string;
  packId: string;
  status: ApplicationStatus;
  submittedAt: string;
  completedAt?: string;
  estimatedCompletionTime?: string;
}

export type ApplicationStatus = 
  | 'draft'
  | 'pending'
  | 'processing'
  | 'complete'
  | 'failed'
  | 'requires-action';

// CRA Income Verification
export interface CRAVerification {
  source: 'CRA';
  status: VerificationStatus;
  taxYear: number;
  totalIncome: number;
  employmentIncome: number;
  verifiedAt?: string;
  factors: EligibilityFactors;
  errorMessage?: string;
}

export type VerificationStatus = 
  | 'pending'
  | 'verified'
  | 'failed'
  | 'not-found';

export interface EligibilityFactors {
  incomeEligibility: boolean;
  thresholdMet: boolean;
  disabilityEligibility?: boolean;
  additionalFactors?: string[];
}

// Complete Application State
export interface ApplicationState {
  personalInfo: PersonalInfo | null;
  disabilityApplication: DisabilityApplication | null;
  consent: Consent | null;
  tracking: ApplicationTracking | null;
  craVerification: CRAVerification | null;
  currentStep: ApplicationStep;
}

export type ApplicationStep = 
  | 'landing'
  | 'login'
  | 'personal-info'
  | 'disability-info'
  | 'consent'
  | 'verification'
  | 'results'
  | 'review'
  | 'confirmation';

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface SubmitApplicationResponse {
  applicationId: string;
  checkId: string;
  packId: string;
  status: ApplicationStatus;
  estimatedCompletionTime: string;
}

export interface VerificationStatusResponse {
  packId: string;
  status: ApplicationStatus;
  progress: number;
  message: string;
  result?: CRAVerification;
}

// Form Props Types
export interface FormStepProps {
  onNext: () => void;
  onBack?: () => void;
}
