import React, { useState } from 'react';
import * as api from '../../api/authentication';
import Form from '../../components/Form/Form';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import { notifyError, notifySuccess } from '../../utils/toastMethods';
import { parseError } from '../../utils/helperMethods';
import { TOAST_POSITIONS } from '../../utils/constants';

const { BOTTOM_CENTER } = TOAST_POSITIONS;

const Profile = ({ user }) => {
  console.log('Profile component received user:', user); // Debugging log
  // Manage submission loading state locally
  const [isSaving, setIsSaving] = useState(false);

  const [profileForm, setProfileForm] = useState({
    username: user?.username || '',
    email: user?.email || '',
    phone_number: user?.phoneNumber || '',
    location: user?.location || '',
    bio: user?.bio || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    if (isSaving) return;

    if (!profileForm.username.trim() || !profileForm.email.trim()) {
      notifyError('Username and Email are required.', BOTTOM_CENTER);
      return;
    }

    try {
      setIsSaving(true);

      const payload = {
        ...profileForm,
        bio: profileForm.bio?.trim() || null,
      };

      await api.updateUser(payload);
      notifySuccess('Profile updated successfully!', BOTTOM_CENTER);
    } catch (err) {
      notifyError(parseError(err), BOTTOM_CENTER);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="profile-container">
      <h2>Your Profile</h2>
      <Form id="profile-form" onSubmit={handleSubmit}>
        <Input
          type="text"
          name="username"
          label="Username"
          placeholder="Username"
          change={handleChange}
          value={profileForm.username}
          animate
          maxLength={25}
        />
        <Input
          type="email"
          name="email"
          label="Email Address"
          placeholder="Email Address"
          change={handleChange}
          value={profileForm.email}
          animate
          preventSpaces
          maxLength={150}
        />
        <Input
          type="tel"
          name="phone_number"
          label="Phone Number"
          placeholder="Phone Number"
          change={handleChange}
          value={profileForm.phone_number}
          animate
          maxLength={20}
        />
        <Input
          type="text"
          name="location"
          label="Location"
          placeholder="Location"
          change={handleChange}
          value={profileForm.location}
          animate
          maxLength={100}
        />
        <Input
          type="text"
          name="bio"
          label="Bio"
          placeholder="Tell us about yourself..."
          change={handleChange}
          value={profileForm.bio}
          animate
          maxLength={1000}
        />

        <Button
          text="Save Changes"
          id="save-profile-button"
          click={handleSubmit}
          isPrimary
          isLoading={isSaving}
          disabled={isSaving}
        />
      </Form>
    </div>
  );
};

export default Profile;
