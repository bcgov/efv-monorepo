import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Callout, Form } from '@bcgov/design-system-react-components';
import { useApplication } from '../context/ApplicationContext';
import './PersonalInfoPage.css';

const PersonalInfoPage: React.FC = () => {
  const navigate = useNavigate();
  const { updatePersonalInfo, user } = useApplication();

  // Pre-populate with BC Services Card data if available
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [dateOfBirth, setDateOfBirth] = useState(user?.dateOfBirth || '');
  const [sin, setSin] = useState(user?.sin || '');
  const [address, setAddress] = useState(user?.address.streetAddress || '');
  const [city, setCity] = useState(user?.address.city || '');
  const [province, setProvince] = useState(user?.address.province || 'BC');
  const [postalCode, setPostalCode] = useState(user?.address.postalCode || '');
  const [phone, setPhone] = useState(user?.phoneNumber || '');
  const [email, setEmail] = useState(user?.email || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!sin.trim()) {
      newErrors.sin = 'SIN is required';
    } else if (!/^\d{3}-?\d{3}-?\d{3}$/.test(sin)) {
      newErrors.sin = 'Invalid SIN format';
    }
    if (!address.trim()) newErrors.address = 'Address is required';
    if (!city.trim()) newErrors.city = 'City is required';
    if (!province.trim()) newErrors.province = 'Province is required';
    if (!postalCode.trim()) {
      newErrors.postalCode = 'Postal code is required';
    } else if (!/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(postalCode)) {
      newErrors.postalCode = 'Invalid postal code format';
    }
    if (!phone.trim()) newErrors.phone = 'Phone is required';
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      updatePersonalInfo({
        firstName,
        lastName,
        dateOfBirth,
        sin,
        phoneNumber: phone,
        email,
        address: {
          streetAddress: address,
          city,
          province,
          postalCode
        }
      });
      navigate('/disability-info');
    }
  };

  return (
    <div className="personal-info-page">
      <h1>Personal Information</h1>
      <p>Please provide your personal information to continue with your application.</p>

      {user && (
        <Callout variant="lightBlue">
          <p>
            <strong>Prototype Note:</strong> Your personal information has been securely retrieved from your BC Services Card. 
            You can review and edit any fields as needed. (This demonstrates automated data pre-population capabilities.)
          </p>
        </Callout>
      )}

      <Form onSubmit={handleSubmit}>
        <div className="form-row">
          <TextField
            label="First Name"
            value={firstName}
            onChange={(value: string) => setFirstName(value)}
            errorMessage={errors.firstName}
            isRequired
          />
          <TextField
            label="Last Name"
            value={lastName}
            onChange={(value: string) => setLastName(value)}
            errorMessage={errors.lastName}
            isRequired
          />
        </div>

        <div className="form-row">
          <TextField
            label="Date of Birth"
            type="date"
            value={dateOfBirth}
            onChange={(value: string) => setDateOfBirth(value)}
            errorMessage={errors.dateOfBirth}
            isRequired
          />
          <TextField
            label="Social Insurance Number"
            value={sin}
            onChange={(value: string) => setSin(value)}
            errorMessage={errors.sin}
            isRequired
          />
        </div>

        <TextField
          label="Address"
          value={address}
          onChange={(value: string) => setAddress(value)}
          errorMessage={errors.address}
          isRequired
        />

        <div className="form-row">
          <TextField
            label="City"
            value={city}
            onChange={(value: string) => setCity(value)}
            errorMessage={errors.city}
            isRequired
          />
          <TextField
            label="Province"
            value={province}
            onChange={(value: string) => setProvince(value)}
            errorMessage={errors.province}
            isRequired
          />
          <TextField
            label="Postal Code"
            value={postalCode}
            onChange={(value: string) => setPostalCode(value)}
            errorMessage={errors.postalCode}
            isRequired
          />
        </div>

        <div className="form-row">
          <TextField
            label="Phone Number"
            type="tel"
            value={phone}
            onChange={(value: string) => setPhone(value)}
            errorMessage={errors.phone}
            isRequired
          />
          <TextField
            label="Email Address"
            type="email"
            value={email}
            onChange={(value: string) => setEmail(value)}
            errorMessage={errors.email}
            isRequired
          />
        </div>

        <div className="form-actions">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Back
          </Button>
          <Button type="submit" variant="primary">
            Continue
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default PersonalInfoPage;
