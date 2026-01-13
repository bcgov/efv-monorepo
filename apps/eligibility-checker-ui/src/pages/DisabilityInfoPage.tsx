import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, TextArea, RadioGroup, Radio } from '@bcgov/design-system-react-components';
import { useApplication } from '../context/ApplicationContext';
import './DisabilityInfoPage.css';

const DisabilityInfoPage: React.FC = () => {
  const navigate = useNavigate();
  const { updateDisabilityInfo } = useApplication();

  const [disabilityDescription, setDisabilityDescription] = useState('');
  const [diagnosisDate, setDiagnosisDate] = useState('');
  const [limitations, setLimitations] = useState('');
  const [requiresAssistance, setRequiresAssistance] = useState('');
  const [hasPhysician, setHasPhysician] = useState('');
  const [physicianName, setPhysicianName] = useState('');
  const [physicianPhone, setPhysicianPhone] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!disabilityDescription.trim()) newErrors.disabilityDescription = 'Disability description is required';
    if (!diagnosisDate) newErrors.diagnosisDate = 'Diagnosis date is required';
    if (!limitations.trim()) newErrors.limitations = 'Please describe your limitations';
    if (!requiresAssistance) newErrors.requiresAssistance = 'Please indicate if you require assistance';
    if (!hasPhysician) newErrors.hasPhysician = 'Please indicate if you have a physician';
    
    if (hasPhysician === 'yes') {
      if (!physicianName.trim()) newErrors.physicianName = 'Physician name is required';
      if (!physicianPhone.trim()) newErrors.physicianPhone = 'Physician phone is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      updateDisabilityInfo({
        applicationType: 'disability',
        hasPhysicalDisability: true,
        hasMentalHealthCondition: false,
        requiresAssistance: requiresAssistance === 'yes',
        disabilityDescription,
        medicalDocumentation: hasPhysician === 'yes'
      });
      navigate('/consent');
    }
  };

  return (
    <div className="disability-info-page">
      <h1>Disability Information</h1>
      <p>Please provide information about your disability to help us assess your eligibility.</p>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Disability Description"
          value={disabilityDescription}
          onChange={(value: string) => setDisabilityDescription(value)}
          errorMessage={errors.disabilityDescription}
          isRequired
        />

        <TextField
          label="Date of Diagnosis"
          type="date"
          value={diagnosisDate}
          onChange={(value: string) => setDiagnosisDate(value)}
          placeholder="yyyy-mm-dd"
          errorMessage={errors.diagnosisDate}
          isRequired
        />

        <TextArea
          label="Description of Limitations"
          value={limitations}
          onChange={(value: string) => setLimitations(value)}
          errorMessage={errors.limitations}
          isRequired
        />

        <RadioGroup
          label="Do you require assistance with daily activities?"
          value={requiresAssistance}
          onChange={(value: string) => setRequiresAssistance(value)}
          isRequired
        >
          <Radio value="yes">Yes</Radio>
          <Radio value="no">No</Radio>
        </RadioGroup>

        <RadioGroup
          label="Do you have a physician who can verify your disability?"
          value={hasPhysician}
          onChange={(value: string) => setHasPhysician(value)}
          isRequired
        >
          <Radio value="yes">Yes</Radio>
          <Radio value="no">No</Radio>
        </RadioGroup>

        {hasPhysician === 'yes' && (
          <div className="physician-details">
            <TextField
              label="Physician Name"
              value={physicianName}
              onChange={(value: string) => setPhysicianName(value)}
              errorMessage={errors.physicianName}
              isRequired
            />
            <TextField
              label="Physician Phone Number"
              type="tel"
              value={physicianPhone}
              onChange={(value: string) => setPhysicianPhone(value)}
              errorMessage={errors.physicianPhone}
              isRequired
            />
          </div>
        )}

        <div className="form-actions">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Back
          </Button>
          <Button type="submit" variant="primary">
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DisabilityInfoPage;
