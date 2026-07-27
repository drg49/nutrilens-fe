import React, { useState } from 'react';
import * as api from '../../api/authentication';
import Form from '../../components/Form/Form';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { notifyError, notifySuccess } from '../../utils/toastMethods';
import { parseError } from '../../utils/helperMethods';
import { TOAST_POSITIONS } from '../../utils/constants';
import Logo from '../../components/Logo/Logo';

const { TOP_CENTER } = TOAST_POSITIONS;

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
      notifyError('Username and Email are required.', TOP_CENTER);
      return;
    }

    try {
      setIsSaving(true);

      const payload = {
        ...profileForm,
        bio: profileForm.bio?.trim() || null,
      };

      await api.updateUser(payload);
      notifySuccess('Profile updated successfully!', TOP_CENTER);
    } catch (err) {
      notifyError(parseError(err), TOP_CENTER);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="profile-container">
      <Logo />
      <h2>Your Profile</h2>
      <Form id="profile-form" onSubmit={handleSubmit}>
        <TextField
          type="text"
          name="username"
          label="Username *"
          placeholder="Username"
          onChange={handleChange}
          value={profileForm.username}
          inputProps={{ maxLength: 25 }}
          fullWidth
          margin="normal"
        />

        <TextField
          type="email"
          name="email"
          label="Email Address *"
          placeholder="Email Address"
          onChange={handleChange}
          value={profileForm.email}
          inputProps={{ maxLength: 150 }}
          fullWidth
          margin="normal"
        />

        <TextField
          type="tel"
          name="phone_number"
          label="Phone Number"
          onChange={handleChange}
          value={profileForm.phone_number}
          inputProps={{ maxLength: 20 }}
          fullWidth
          margin="normal"
        />

        <TextField
          type="text"
          name="location"
          label="Country"
          onChange={handleChange}
          value={profileForm.location}
          inputProps={{ maxLength: 100 }}
          fullWidth
          margin="normal"
        />

        <TextField
          type="text"
          name="bio"
          label="Bio"
          placeholder="Tell us about yourself..."
          onChange={handleChange}
          value={profileForm.bio}
          inputProps={{ maxLength: 1000 }}
          fullWidth
          margin="normal"
        />

        <Button
          id="save-profile-button"
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={isSaving}
          type="button"
        >
          {isSaving ? (
            <CircularProgress size={18} color="inherit" />
          ) : (
            'Save Changes'
          )}
        </Button>
      </Form>
    </div>
  );
};

export default Profile;
