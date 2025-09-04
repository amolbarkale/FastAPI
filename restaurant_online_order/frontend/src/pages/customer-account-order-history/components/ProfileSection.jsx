// src/pages/customer-account-order-history/components/ProfileSection.jsx
import React, { useState } from 'react';
import Icon from 'components/AppIcon';

function ProfileSection({ userProfile, setUserProfile }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(userProfile);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const dietaryOptions = [
    { id: 'vegetarian', label: 'Vegetarian', icon: 'Leaf' },
    { id: 'vegan', label: 'Vegan', icon: 'Sprout' },
    { id: 'gluten-free', label: 'Gluten-Free', icon: 'Wheat' },
    { id: 'keto', label: 'Keto', icon: 'Zap' },
    { id: 'low-sodium', label: 'Low Sodium', icon: 'Heart' },
    { id: 'diabetic', label: 'Diabetic Friendly', icon: 'Activity' }
  ];

  const handleEditToggle = () => {
    if (isEditing) {
      setEditForm(userProfile);
      setErrors({});
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name?.startsWith('notifications.')) {
      const notificationType = name?.split('.')[1];
      setEditForm(prev => ({
        ...prev,
        notifications: {
          ...prev?.notifications,
          [notificationType]: checked
        }
      }));
    } else {
      setEditForm(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleDietaryChange = (dietaryId) => {
    setEditForm(prev => {
      const current = prev?.dietaryPreferences || [];
      const updated = current?.includes(dietaryId)
        ? current?.filter(d => d !== dietaryId)
        : [...current, dietaryId];
      
      return {
        ...prev,
        dietaryPreferences: updated
      };
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!editForm?.firstName?.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!editForm?.lastName?.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!editForm?.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(editForm?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (editForm?.phone && !/^[+]?[1-9]?\d{10,14}$/.test(editForm?.phone?.replace(/[^\d]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUserProfile(editForm);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAccountAction = (action) => {
    console.log(`${action} clicked`);
    // In real app, these would trigger appropriate modals/flows
  };

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <div className="bg-surface rounded-lg shadow-soft p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-heading-medium text-text-primary">
            Personal Information
          </h2>
          <button
            onClick={handleEditToggle}
            className="flex items-center space-x-2 px-4 py-2 text-primary hover:bg-primary-50 rounded-lg transition-smooth font-body font-body-medium"
          >
            <Icon name={isEditing ? "X" : "Edit"} size={18} />
            <span>{isEditing ? 'Cancel' : 'Edit'}</span>
          </button>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-body font-body-medium text-text-primary mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={editForm?.firstName || ''}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth font-body ${
                    errors?.firstName ? 'border-error' : 'border-border'
                  }`}
                  placeholder="Enter your first name"
                />
                {errors?.firstName && (
                  <p className="text-error text-sm font-body mt-1">{errors?.firstName}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-body font-body-medium text-text-primary mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={editForm?.lastName || ''}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth font-body ${
                    errors?.lastName ? 'border-error' : 'border-border'
                  }`}
                  placeholder="Enter your last name"
                />
                {errors?.lastName && (
                  <p className="text-error text-sm font-body mt-1">{errors?.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-body font-body-medium text-text-primary mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={editForm?.email || ''}
                onChange={handleInputChange}
                className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth font-body ${
                  errors?.email ? 'border-error' : 'border-border'
                }`}
                placeholder="Enter your email"
              />
              {errors?.email && (
                <p className="text-error text-sm font-body mt-1">{errors?.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-body font-body-medium text-text-primary mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={editForm?.phone || ''}
                onChange={handleInputChange}
                className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth font-body ${
                  errors?.phone ? 'border-error' : 'border-border'
                }`}
                placeholder="+1 (555) 123-4567"
              />
              {errors?.phone && (
                <p className="text-error text-sm font-body mt-1">{errors?.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-body font-body-medium text-text-primary mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={editForm?.dateOfBirth || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth font-body"
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-smooth font-body font-body-medium"
              >
                {isSaving && <Icon name="Loader2" size={18} className="animate-spin" />}
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </button>
              <button
                onClick={handleEditToggle}
                className="px-6 py-3 border border-border text-text-secondary rounded-lg hover:bg-secondary-50 transition-smooth font-body font-body-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-body text-text-secondary mb-1">
                  Name
                </label>
                <p className="font-body text-text-primary">
                  {userProfile?.firstName} {userProfile?.lastName}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-body text-text-secondary mb-1">
                  Email
                </label>
                <p className="font-body text-text-primary">{userProfile?.email}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-body text-text-secondary mb-1">
                  Phone
                </label>
                <p className="font-body text-text-primary">
                  {userProfile?.phone || 'Not provided'}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-body text-text-secondary mb-1">
                  Date of Birth
                </label>
                <p className="font-body text-text-primary">
                  {userProfile?.dateOfBirth || 'Not provided'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dietary Preferences */}
      <div className="bg-surface rounded-lg shadow-soft p-6">
        <h3 className="text-lg font-heading font-heading-medium text-text-primary mb-4">
          Dietary Preferences
        </h3>
        
        {isEditing ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {dietaryOptions?.map((option) => (
              <label
                key={option?.id}
                className="flex items-center space-x-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-secondary-50 transition-smooth"
              >
                <input
                  type="checkbox"
                  checked={editForm?.dietaryPreferences?.includes(option?.id) || false}
                  onChange={() => handleDietaryChange(option?.id)}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
                />
                <Icon name={option?.icon} size={18} className="text-text-secondary" />
                <span className="text-sm font-body text-text-primary">{option?.label}</span>
              </label>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {userProfile?.dietaryPreferences?.length > 0 ? (
              userProfile?.dietaryPreferences?.map((preference) => {
                const option = dietaryOptions?.find(opt => opt?.id === preference);
                return option ? (
                  <span
                    key={preference}
                    className="inline-flex items-center space-x-2 px-3 py-2 bg-success-100 text-success-700 rounded-full text-sm font-body"
                  >
                    <Icon name={option?.icon} size={16} />
                    <span>{option?.label}</span>
                  </span>
                ) : null;
              })
            ) : (
              <p className="text-text-secondary font-body">No dietary preferences set</p>
            )}
          </div>
        )}
      </div>

      {/* Notification Settings */}
      <div className="bg-surface rounded-lg shadow-soft p-6">
        <h3 className="text-lg font-heading font-heading-medium text-text-primary mb-4">
          Notification Preferences
        </h3>
        
        <div className="space-y-4">
          <label className="flex items-center justify-between p-3 border border-border rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon name="Mail" size={20} className="text-text-secondary" />
              <div>
                <p className="font-body font-body-medium text-text-primary">Email Notifications</p>
                <p className="text-sm text-text-secondary">Order updates, promotions, and news</p>
              </div>
            </div>
            <input
              type="checkbox"
              name="notifications.email"
              checked={isEditing ? editForm?.notifications?.email : userProfile?.notifications?.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-5 h-5 text-primary border-border rounded focus:ring-primary focus:ring-2"
            />
          </label>
          
          <label className="flex items-center justify-between p-3 border border-border rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon name="MessageSquare" size={20} className="text-text-secondary" />
              <div>
                <p className="font-body font-body-medium text-text-primary">SMS Notifications</p>
                <p className="text-sm text-text-secondary">Order status updates via text</p>
              </div>
            </div>
            <input
              type="checkbox"
              name="notifications.sms"
              checked={isEditing ? editForm?.notifications?.sms : userProfile?.notifications?.sms}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-5 h-5 text-primary border-border rounded focus:ring-primary focus:ring-2"
            />
          </label>
          
          <label className="flex items-center justify-between p-3 border border-border rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon name="Bell" size={20} className="text-text-secondary" />
              <div>
                <p className="font-body font-body-medium text-text-primary">Push Notifications</p>
                <p className="text-sm text-text-secondary">Real-time alerts on your device</p>
              </div>
            </div>
            <input
              type="checkbox"
              name="notifications.push"
              checked={isEditing ? editForm?.notifications?.push : userProfile?.notifications?.push}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-5 h-5 text-primary border-border rounded focus:ring-primary focus:ring-2"
            />
          </label>
        </div>
      </div>

      {/* Account Management */}
      <div className="bg-surface rounded-lg shadow-soft p-6">
        <h3 className="text-lg font-heading font-heading-medium text-text-primary mb-4">
          Account Management
        </h3>
        
        <div className="space-y-3">
          <button
            onClick={() => handleAccountAction('change-password')}
            className="w-full flex items-center justify-between p-3 border border-border rounded-lg hover:bg-secondary-50 transition-smooth text-left"
          >
            <div className="flex items-center space-x-3">
              <Icon name="Lock" size={20} className="text-text-secondary" />
              <span className="font-body text-text-primary">Change Password</span>
            </div>
            <Icon name="ChevronRight" size={20} className="text-text-secondary" />
          </button>
          
          <button
            onClick={() => handleAccountAction('download-data')}
            className="w-full flex items-center justify-between p-3 border border-border rounded-lg hover:bg-secondary-50 transition-smooth text-left"
          >
            <div className="flex items-center space-x-3">
              <Icon name="Download" size={20} className="text-text-secondary" />
              <span className="font-body text-text-primary">Download My Data</span>
            </div>
            <Icon name="ChevronRight" size={20} className="text-text-secondary" />
          </button>
          
          <button
            onClick={() => handleAccountAction('delete-account')}
            className="w-full flex items-center justify-between p-3 border border-error rounded-lg hover:bg-error-50 transition-smooth text-left"
          >
            <div className="flex items-center space-x-3">
              <Icon name="Trash2" size={20} className="text-error" />
              <span className="font-body text-error">Delete Account</span>
            </div>
            <Icon name="ChevronRight" size={20} className="text-error" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileSection;