import type { 
  ApiResponse, 
  SubmitApplicationResponse, 
  VerificationStatusResponse, 
  Consent,
  PersonalInfo,
  DisabilityApplication,
  BCServicesCard,
  CRAVerification
} from '../types';
import { aminaUser, aminaCRAVerification } from './mockData';

// Simulated network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock authentication service
export const mockAuthService = {
  /**
   * Simulates BC Services Card login
   */
  async loginWithBCServicesCard(_mockUserId: string = 'BCSC-AMI-2025-001'): Promise<ApiResponse<BCServicesCard>> {
    await delay(1500); // Simulate authentication delay
    
    // For prototype, always return Amina's profile
    return {
      success: true,
      data: aminaUser,
      message: 'Successfully authenticated with BC Services Card'
    };
  },

  /**
   * Simulates session validation
   */
  async validateSession(_sessionToken: string): Promise<ApiResponse<boolean>> {
    await delay(300);
    return {
      success: true,
      data: true,
      message: 'Session is valid'
    };
  }
};

// Mock EFV API service
export const mockEFVService = {
  /**
   * Submit consent for CRA data access
   */
  async submitConsent(consent: Omit<Consent, 'consentId' | 'timestamp'>): Promise<ApiResponse<Consent>> {
    await delay(800);
    
    const consentRecord: Consent = {
      ...consent,
      consentId: `CONSENT-${Date.now()}`,
      timestamp: new Date().toISOString()
    };

    return {
      success: true,
      data: consentRecord,
      message: 'Consent recorded successfully'
    };
  },

  /**
   * Submit complete application for processing
   */
  async submitApplication(
    _personalInfo: PersonalInfo,
    _disabilityApp: DisabilityApplication,
    _consent: Consent
  ): Promise<ApiResponse<SubmitApplicationResponse>> {
    await delay(1200);

    const applicationId = `APP-2025-${Date.now()}`;
    const checkId = `CHK-${Date.now()}`;
    const packId = `PACK-${Date.now()}`;

    const response: SubmitApplicationResponse = {
      applicationId,
      checkId,
      packId,
      status: 'pending',
      estimatedCompletionTime: new Date(Date.now() + 5000).toISOString() // 5 seconds from now
    };

    return {
      success: true,
      data: response,
      message: 'Application submitted successfully. Income verification in progress.'
    };
  },

  /**
   * Check verification status (simulates CRA processing)
   */
  async checkVerificationStatus(packId: string): Promise<ApiResponse<VerificationStatusResponse>> {
    await delay(500);

    // Simulate different states based on time
    const randomState = Math.random();
    
    if (randomState < 0.3) {
      // 30% chance - still pending
      return {
        success: true,
        data: {
          packId,
          status: 'pending',
          progress: 30,
          message: 'Contacting CRA for income verification...'
        }
      };
    } else if (randomState < 0.6) {
      // 30% chance - processing
      return {
        success: true,
        data: {
          packId,
          status: 'processing',
          progress: 60,
          message: 'Receiving data from CRA...'
        }
      };
    } else {
      // 40% chance - complete
      return {
        success: true,
        data: {
          packId,
          status: 'complete',
          progress: 100,
          message: 'Income verification complete',
          result: aminaCRAVerification
        }
      };
    }
  },

  /**
   * Get verification results
   */
  async getVerificationResults(_packId: string): Promise<ApiResponse<CRAVerification>> {
    await delay(600);

    return {
      success: true,
      data: {
        ...aminaCRAVerification,
        verifiedAt: new Date().toISOString()
      },
      message: 'Verification results retrieved successfully'
    };
  },

  /**
   * Poll verification status until complete (max 30 seconds)
   */
  async pollVerificationStatus(
    packId: string,
    onProgress?: (status: VerificationStatusResponse) => void,
    maxAttempts: number = 60
  ): Promise<ApiResponse<CRAVerification>> {
    let attempts = 0;

    while (attempts < maxAttempts) {
      const statusResponse = await this.checkVerificationStatus(packId);
      
      if (!statusResponse.success || !statusResponse.data) {
        return {
          success: false,
          error: 'Failed to check verification status'
        };
      }

      const status = statusResponse.data;
      
      // Call progress callback if provided
      if (onProgress) {
        onProgress(status);
      }

      // Check if complete
      if (status.status === 'complete' && status.result) {
        return {
          success: true,
          data: status.result,
          message: 'Verification completed successfully'
        };
      }

      // Check if failed
      if (status.status === 'failed') {
        return {
          success: false,
          error: 'Verification failed'
        };
      }

      // Wait 500ms before next poll
      await delay(500);
      attempts++;
    }

    // Timeout
    return {
      success: false,
      error: 'Verification timeout - please try again later'
    };
  }
};

// Export all services
export default {
  auth: mockAuthService,
  efv: mockEFVService
};
