'use client';
import React, { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/sidebar';

const Profile = () => {
  const { isLoaded, userId } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const router = useRouter();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    primaryEmailAddress: '',
    phoneNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (userLoaded && user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        username: user.username || '',
        primaryEmailAddress: user.primaryEmailAddress?.emailAddress || '',
        phoneNumber: user.primaryPhoneNumber?.phoneNumber || '',
      });
    }
  }, [user, userLoaded]);

  if (!isLoaded || !userLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!userId) {
    router.push('/login');
    return <div>Redirecting to login...</div>;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      // Validate input
      if (!formData.firstName.trim() || !formData.lastName.trim()) {
        setMessage({ type: 'error', text: 'First name and last name are required.' });
        setLoading(false);
        return;
      }

      console.log('Current user object:', user);
      console.log('Form data to update:', formData);

      // Try updating fields one by one to identify which one is causing issues
      let updateSuccess = false;

      // Update first name
      if (formData.firstName.trim() !== user.firstName) {
        console.log('Updating firstName...');
        await user.update({ firstName: formData.firstName.trim() });
        updateSuccess = true;
      }

      // Update last name
      if (formData.lastName.trim() !== user.lastName) {
        console.log('Updating lastName...');
        await user.update({ lastName: formData.lastName.trim() });
        updateSuccess = true;
      }

      // Update username (this might be the problematic field)
      if (formData.username.trim() && formData.username.trim() !== user.username) {
        console.log('Updating username...');
        try {
          await user.update({ username: formData.username.trim() });
          updateSuccess = true;
        } catch (usernameError) {
          console.error('Username update failed:', usernameError);
          // Continue with other updates, but note the username error
          if (usernameError.errors && usernameError.errors[0]) {
            setMessage({ 
              type: 'error', 
              text: `Username update failed: ${usernameError.errors[0].message || usernameError.errors[0].code}` 
            });
          }
        }
      }

      if (updateSuccess) {
        // Reload user data to get the latest information
        await user.reload();
        
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setIsEditing(false);
        
        // Update form data with the latest user data
        setFormData({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          username: user.username || '',
          primaryEmailAddress: user.primaryEmailAddress?.emailAddress || '',
          phoneNumber: user.primaryPhoneNumber?.phoneNumber || '',
        });
      } else if (!message.text) {
        setMessage({ type: 'info', text: 'No changes detected.' });
      }

    } catch (error) {
      console.error('Error updating profile:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      
      // More specific error messages
      let errorMessage = 'Failed to update profile. Please try again.';
      
      if (error.errors && error.errors.length > 0) {
        // Handle Clerk validation errors
        const clerkError = error.errors[0];
        console.log('Clerk error:', clerkError);
        
        if (clerkError.code === 'form_identifier_exists') {
          errorMessage = 'This username is already taken. Please choose a different one.';
        } else if (clerkError.code === 'form_param_format_invalid') {
          errorMessage = 'Invalid format for one of the fields. Please check your input.';
        } else if (clerkError.code === 'form_param_unknown') {
          errorMessage = 'One of the fields cannot be updated. Try updating name fields only.';
        } else if (clerkError.message) {
          errorMessage = clerkError.message;
        } else {
          errorMessage = `Error: ${clerkError.code || 'Unknown error'}`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      username: user.username || '',
      primaryEmailAddress: user.primaryEmailAddress?.emailAddress || '',
      phoneNumber: user.primaryPhoneNumber?.phoneNumber || '',
    });
    setIsEditing(false);
    setMessage({ type: '', text: '' });
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 ml-64 p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-3">Profile Settings</h1>
          <p className="text-muted-foreground text-lg">Manage your account information and preferences</p>
        </header>

        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-card rounded-3xl shadow-lg p-8 mb-8 border border-border">
            <div className="flex items-center space-x-6 mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-3xl font-bold">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </div>
                {user.imageUrl && (
                  <img 
                    src={user.imageUrl} 
                    alt="Profile" 
                    className="w-24 h-24 rounded-full object-cover absolute inset-0"
                  />
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-card-foreground mb-2">
                  {user.fullName || 'User Profile'}
                </h2>
                <p className="text-muted-foreground mb-4">
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </p>
                <div className="flex space-x-3">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-2xl transition-all duration-300 font-medium"
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex space-x-3">
                      <button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-2xl transition-all duration-300 font-medium disabled:opacity-50"
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="bg-muted hover:bg-accent text-muted-foreground px-6 py-2 rounded-2xl transition-all duration-300 font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Message Display */}
            {message.text && (
              <div className={`p-4 rounded-2xl mb-6 ${
                message.type === 'success' 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}>
                {message.text}
              </div>
            )}
          </div>

          {/* Profile Information */}
          <div className="bg-card rounded-3xl shadow-lg p-8 border border-border">
            <h3 className="text-xl font-bold text-card-foreground mb-6">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className="block text-sm font-semibold text-card-foreground mb-2">
                  First Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full bg-background text-foreground border-2 border-input rounded-2xl px-4 py-3 focus:ring-4 focus:ring-ring focus:border-primary transition-all duration-300"
                    placeholder="Enter your first name"
                  />
                ) : (
                  <p className="bg-muted p-3 rounded-2xl text-card-foreground">
                    {formData.firstName || 'Not provided'}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-semibold text-card-foreground mb-2">
                  Last Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full bg-background text-foreground border-2 border-input rounded-2xl px-4 py-3 focus:ring-4 focus:ring-ring focus:border-primary transition-all duration-300"
                    placeholder="Enter your last name"
                  />
                ) : (
                  <p className="bg-muted p-3 rounded-2xl text-card-foreground">
                    {formData.lastName || 'Not provided'}
                  </p>
                )}
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-semibold text-card-foreground mb-2">
                  Username
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full bg-background text-foreground border-2 border-input rounded-2xl px-4 py-3 focus:ring-4 focus:ring-ring focus:border-primary transition-all duration-300"
                    placeholder="Enter your username"
                  />
                ) : (
                  <p className="bg-muted p-3 rounded-2xl text-card-foreground">
                    {formData.username || 'Not provided'}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-card-foreground mb-2">
                  Email Address
                </label>
                <p className="bg-muted p-3 rounded-2xl text-card-foreground">
                  {formData.primaryEmailAddress || 'Not provided'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Email cannot be changed here. Use Clerk's user management.
                </p>
              </div>

              {/* Phone */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-card-foreground mb-2">
                  Phone Number
                </label>
                <p className="bg-muted p-3 rounded-2xl text-card-foreground">
                  {formData.phoneNumber || 'Not provided'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Phone number management available through account settings.
                </p>
              </div>
            </div>
          </div>

          {/* Account Statistics */}
          <div className="bg-card rounded-3xl shadow-lg p-8 mt-8 border border-border">
            <h3 className="text-xl font-bold text-card-foreground mb-6">Account Statistics</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-muted rounded-2xl">
                <div className="text-2xl font-bold text-primary mb-2">0</div>
                <div className="text-sm text-muted-foreground">Tests Completed</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-2xl">
                <div className="text-2xl font-bold text-primary mb-2">0</div>
                <div className="text-sm text-muted-foreground">Notes Saved</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-2xl">
                <div className="text-2xl font-bold text-primary mb-2">
                  {Math.floor((Date.now() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24))}
                </div>
                <div className="text-sm text-muted-foreground">Days Active</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;