import React, { useState } from 'react';

import Form from '../../components/Form/Form';
import Input from '../../components/Input/Input';
import SingleSelect from '../../components/SingleSelect/SingleSelect';
import Button from '../../components/Button/Button';

import * as api from '../../api/authentication';
import { formContainsEmptyValues } from '../../utils/validation';
import { parseError } from '../../utils/helperMethods';
import { notifyError } from '../../utils/toastMethods';
import { TOAST_POSITIONS, countries } from '../../utils/constants';

const { TOP_CENTER } = TOAST_POSITIONS;

const Register = ({ isLoading, setIsLoading }) => {
  // Track the registration step (1: Required Credentials, 2: Remaining Optional Details)
  const [step, setStep] = useState(1);

  const [registerForm, setRegisterForm] = useState({
    // Step 1 Fields
    username: '',
    email: '',
    password: '',

    // Step 2 Fields
    phone_number: '',
    bio: '',
    location: 'United States',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setRegisterForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Step 1 Data Normalization
  const normalizeAuthData = (form) => ({
    username: form.username.trim(),
    email: form.email.trim().toLowerCase(),
    password: form.password,
  });

  // Step 2 Data Normalization
  const normalizeProfileData = (form) => ({
    phone_number: form.phone_number.trim() || null,
    bio: form.bio?.trim() || null,
    location: form.location.trim() || null,
  });

  // Handles Step 1 Submission
  const handleAuthSubmit = async (e) => {
    e?.preventDefault?.();

    if (isLoading) return;

    if (
      formContainsEmptyValues({
        username: registerForm.username,
        email: registerForm.email,
        password: registerForm.password,
      })
    ) {
      notifyError('Please fill required fields', TOP_CENTER);
      return;
    }

    try {
      setIsLoading(true);

      await api.register(normalizeAuthData(registerForm));

      setStep(2);
    } catch (err) {
      notifyError(parseError(err), TOP_CENTER);
    } finally {
      setIsLoading(false);
    }
  };

  // Handles Step 2 Submission
  const handleProfileSubmit = async (e) => {
    e?.preventDefault?.();

    if (isLoading) return;

    try {
      setIsLoading(true);

      await api.updateUser(normalizeProfileData(registerForm));

      window.location.reload();
    } catch (err) {
      notifyError(parseError(err), TOP_CENTER);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form
      id="register-form"
      onSubmit={step === 1 ? handleAuthSubmit : handleProfileSubmit}
    >
      {step === 1 ? (
        <>
          <h2>Create Your Account</h2>
          <br />

          <Input
            type="text"
            name="username"
            label="Username"
            placeholder="Username *"
            change={handleChange}
            value={registerForm.username}
            animate
            maxLength={25}
          />

          <Input
            type="email"
            name="email"
            label="Email Address"
            placeholder="Email *"
            change={handleChange}
            value={registerForm.email}
            animate
            preventSpaces
            maxLength={150}
          />

          <Input
            type="password"
            name="password"
            label="Password"
            placeholder="Password *"
            change={handleChange}
            value={registerForm.password}
            animate
            preventSpaces
            maxLength={255}
          />

          <Button
            text="Continue"
            id="register-button"
            click={handleAuthSubmit}
            isPrimary
            isLoading={isLoading}
            disabled={isLoading}
          />
        </>
      ) : (
        <>
          <h2>
            Nice to meet you {registerForm.username}! Tell us a bit more about
            yourself.
          </h2>

          <br />

          <Input
            type="tel"
            name="phone_number"
            label="Phone Number"
            placeholder="Optional"
            change={handleChange}
            value={registerForm.phone_number}
            animate
            maxLength={20}
          />

          <SingleSelect
            name="location"
            label="Country"
            options={countries}
            value={registerForm.location}
            change={handleChange}
          />

          <Input
            id="bio-field"
            type="text"
            name="bio"
            label="Bio"
            placeholder="Optional"
            change={handleChange}
            value={registerForm.bio}
            animate
            maxLength={1000}
          />

          <Button
            text="Complete Profile"
            id="profile-button"
            click={handleProfileSubmit}
            isPrimary
            isLoading={isLoading}
            disabled={isLoading}
          />
        </>
      )}
    </Form>
  );
};

export default Register;
