import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { 
  ApplicationState, 
  ApplicationStep, 
  PersonalInfo, 
  DisabilityApplication, 
  Consent, 
  ApplicationTracking, 
  CRAVerification,
  BCServicesCard 
} from '../types';

interface ApplicationContextType {
  state: ApplicationState;
  user: BCServicesCard | null;
  setUser: (user: BCServicesCard | null) => void;
  setPersonalInfo: (info: PersonalInfo) => void;
  setDisabilityApplication: (app: DisabilityApplication) => void;
  setConsent: (consent: Consent) => void;
  setTracking: (tracking: ApplicationTracking) => void;
  setCRAVerification: (verification: CRAVerification) => void;
  setCurrentStep: (step: ApplicationStep) => void;
  resetApplication: () => void;
  updatePersonalInfo: (info: PersonalInfo) => void;
  updateDisabilityInfo: (app: DisabilityApplication) => void;
  updateConsent: (consent: Consent) => void;
  updateVerification: (verification: CRAVerification) => void;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

const initialState: ApplicationState = {
  personalInfo: null,
  disabilityApplication: null,
  consent: null,
  tracking: null,
  craVerification: null,
  currentStep: 'landing'
};

interface ApplicationProviderProps {
  children: ReactNode;
}

export const ApplicationProvider: React.FC<ApplicationProviderProps> = ({ children }) => {
  const [state, setState] = useState<ApplicationState>(initialState);
  const [user, setUser] = useState<BCServicesCard | null>(null);

  const setPersonalInfo = (info: PersonalInfo) => {
    setState(prev => ({ ...prev, personalInfo: info }));
  };

  const setDisabilityApplication = (app: DisabilityApplication) => {
    setState(prev => ({ ...prev, disabilityApplication: app }));
  };

  const setConsent = (consent: Consent) => {
    setState(prev => ({ ...prev, consent }));
  };

  const setTracking = (tracking: ApplicationTracking) => {
    setState(prev => ({ ...prev, tracking }));
  };

  const setCRAVerification = (verification: CRAVerification) => {
    setState(prev => ({ ...prev, craVerification: verification }));
  };

  const setCurrentStep = (step: ApplicationStep) => {
    setState(prev => ({ ...prev, currentStep: step }));
  };

  const resetApplication = () => {
    setState(initialState);
    setUser(null);
  };

  const value: ApplicationContextType = {
    state,
    user,
    setUser,
    setPersonalInfo,
    setDisabilityApplication,
    setConsent,
    setTracking,
    setCRAVerification,
    setCurrentStep,
    resetApplication,
    // Aliases for convenience
    updatePersonalInfo: setPersonalInfo,
    updateDisabilityInfo: setDisabilityApplication,
    updateConsent: setConsent,
    updateVerification: setCRAVerification
  };

  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplication = (): ApplicationContextType => {
  const context = useContext(ApplicationContext);
  if (context === undefined) {
    throw new Error('useApplication must be used within an ApplicationProvider');
  }
  return context;
};

export default ApplicationContext;
