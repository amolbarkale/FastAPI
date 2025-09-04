// src/pages/customer-account-order-history/components/AddressesSection.jsx
import React, { useState } from 'react';
import Icon from 'components/AppIcon';

function AddressesSection() {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: 'home',
      label: 'Home',
      street: '123 Main Street',
      apartment: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
      isDefault: true,
      deliveryInstructions: 'Leave at door, ring bell twice'
    },
    {
      id: 2,
      type: 'work',
      label: 'Office',
      street: '456 Business Ave',
      apartment: 'Suite 200',
      city: 'New York',
      state: 'NY',
      zipCode: '10002',
      country: 'United States',
      isDefault: false,
      deliveryInstructions: 'Call when arriving, security at front desk'
    }
  ]);
  
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    type: 'home',
    label: '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    deliveryInstructions: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const addressTypes = [
    { value: 'home', label: 'Home', icon: 'Home' },
    { value: 'work', label: 'Work', icon: 'Building' },
    { value: 'other', label: 'Other', icon: 'MapPin' }
  ];

  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddressForm(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!addressForm?.label?.trim()) {
      newErrors.label = 'Address label is required';
    }
    if (!addressForm?.street?.trim()) {
      newErrors.street = 'Street address is required';
    }
    if (!addressForm?.city?.trim()) {
      newErrors.city = 'City is required';
    }
    if (!addressForm?.state) {
      newErrors.state = 'State is required';
    }
    if (!addressForm?.zipCode?.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    } else if (!/^\d{5}(-\d{4})?$/.test(addressForm?.zipCode)) {
      newErrors.zipCode = 'Please enter a valid ZIP code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddAddress = () => {
    setAddressForm({
      type: 'home',
      label: '',
      street: '',
      apartment: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
      deliveryInstructions: ''
    });
    setErrors({});
    setIsAddingAddress(true);
  };

  const handleEditAddress = (address) => {
    setAddressForm(address);
    setErrors({});
    setEditingAddress(address?.id);
  };

  const handleSaveAddress = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingAddress) {
        setAddresses(prev => prev?.map(addr => 
          addr?.id === editingAddress 
            ? { ...addressForm, id: editingAddress }
            : addr
        ));
        setEditingAddress(null);
      } else {
        const newAddress = {
          ...addressForm,
          id: Date.now(),
          isDefault: addresses?.length === 0
        };
        setAddresses(prev => [...prev, newAddress]);
        setIsAddingAddress(false);
      }
      
      setAddressForm({
        type: 'home',
        label: '',
        street: '',
        apartment: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States',
        deliveryInstructions: ''
      });
    } catch (error) {
      console.error('Failed to save address:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsAddingAddress(false);
    setEditingAddress(null);
    setAddressForm({
      type: 'home',
      label: '',
      street: '',
      apartment: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
      deliveryInstructions: ''
    });
    setErrors({});
  };

  const handleDeleteAddress = async (addressId) => {
    if (!confirm('Are you sure you want to delete this address?')) {
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setAddresses(prev => prev?.filter(addr => addr?.id !== addressId));
    } catch (error) {
      console.error('Failed to delete address:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetDefault = async (addressId) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setAddresses(prev => prev?.map(addr => ({
        ...addr,
        isDefault: addr?.id === addressId
      })));
    } catch (error) {
      console.error('Failed to set default address:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAddressTypeIcon = (type) => {
    const typeInfo = addressTypes?.find(t => t?.value === type);
    return typeInfo?.icon || 'MapPin';
  };

  const formatAddress = (address) => {
    const parts = [address?.street];
    if (address?.apartment) parts.push(address?.apartment);
    parts.push(`${address?.city}, ${address?.state} ${address?.zipCode}`);
    return parts?.join(', ');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-heading font-heading-medium text-text-primary">
            Delivery Addresses
          </h2>
          <p className="text-text-secondary font-body mt-1">
            Manage your saved delivery addresses for quick checkout
          </p>
        </div>
        
        {!isAddingAddress && !editingAddress && (
          <button
            onClick={handleAddAddress}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-smooth font-body font-body-medium"
          >
            <Icon name="Plus" size={18} />
            <span>Add Address</span>
          </button>
        )}
      </div>

      {/* Add/Edit Address Form */}
      {(isAddingAddress || editingAddress) && (
        <div className="bg-surface rounded-lg shadow-soft p-6">
          <h3 className="text-lg font-heading font-heading-medium text-text-primary mb-6">
            {editingAddress ? 'Edit Address' : 'Add New Address'}
          </h3>
          
          <div className="space-y-4">
            {/* Address Type */}
            <div>
              <label className="block text-sm font-body font-body-medium text-text-primary mb-2">
                Address Type
              </label>
              <div className="grid grid-cols-3 gap-3">
                {addressTypes?.map(type => (
                  <label
                    key={type?.value}
                    className={`flex items-center justify-center space-x-2 p-3 border rounded-lg cursor-pointer transition-smooth ${
                      addressForm?.type === type?.value
                        ? 'border-primary bg-primary-50 text-primary' :'border-border hover:bg-secondary-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value={type?.value}
                      checked={addressForm?.type === type?.value}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <Icon name={type?.icon} size={18} />
                    <span className="font-body font-body-medium">{type?.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Label */}
            <div>
              <label className="block text-sm font-body font-body-medium text-text-primary mb-2">
                Address Label *
              </label>
              <input
                type="text"
                name="label"
                value={addressForm?.label}
                onChange={handleInputChange}
                className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth font-body ${
                  errors?.label ? 'border-error' : 'border-border'
                }`}
                placeholder="e.g., Home, Office, Mom's House"
              />
              {errors?.label && (
                <p className="text-error text-sm font-body mt-1">{errors?.label}</p>
              )}
            </div>

            {/* Street Address */}
            <div>
              <label className="block text-sm font-body font-body-medium text-text-primary mb-2">
                Street Address *
              </label>
              <input
                type="text"
                name="street"
                value={addressForm?.street}
                onChange={handleInputChange}
                className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth font-body ${
                  errors?.street ? 'border-error' : 'border-border'
                }`}
                placeholder="123 Main Street"
              />
              {errors?.street && (
                <p className="text-error text-sm font-body mt-1">{errors?.street}</p>
              )}
            </div>

            {/* Apartment/Suite */}
            <div>
              <label className="block text-sm font-body font-body-medium text-text-primary mb-2">
                Apartment, Suite, Unit (Optional)
              </label>
              <input
                type="text"
                name="apartment"
                value={addressForm?.apartment}
                onChange={handleInputChange}
                className="w-full px-3 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth font-body"
                placeholder="Apt 4B, Suite 200, Unit 5"
              />
            </div>

            {/* City, State, ZIP */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-body font-body-medium text-text-primary mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={addressForm?.city}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth font-body ${
                    errors?.city ? 'border-error' : 'border-border'
                  }`}
                  placeholder="New York"
                />
                {errors?.city && (
                  <p className="text-error text-sm font-body mt-1">{errors?.city}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-body font-body-medium text-text-primary mb-2">
                  State *
                </label>
                <select
                  name="state"
                  value={addressForm?.state}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth font-body ${
                    errors?.state ? 'border-error' : 'border-border'
                  }`}
                >
                  <option value="">Select State</option>
                  {states?.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                {errors?.state && (
                  <p className="text-error text-sm font-body mt-1">{errors?.state}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-body font-body-medium text-text-primary mb-2">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={addressForm?.zipCode}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth font-body ${
                    errors?.zipCode ? 'border-error' : 'border-border'
                  }`}
                  placeholder="10001"
                />
                {errors?.zipCode && (
                  <p className="text-error text-sm font-body mt-1">{errors?.zipCode}</p>
                )}
              </div>
            </div>

            {/* Delivery Instructions */}
            <div>
              <label className="block text-sm font-body font-body-medium text-text-primary mb-2">
                Delivery Instructions (Optional)
              </label>
              <textarea
                name="deliveryInstructions"
                value={addressForm?.deliveryInstructions}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth font-body resize-none"
                placeholder="Special instructions for delivery (e.g., gate code, building entrance, where to leave package)"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                onClick={handleSaveAddress}
                disabled={isLoading}
                className="flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-smooth font-body font-body-medium"
              >
                {isLoading && <Icon name="Loader2" size={18} className="animate-spin" />}
                <span>{isLoading ? 'Saving...' : (editingAddress ? 'Update Address' : 'Save Address')}</span>
              </button>
              
              <button
                onClick={handleCancelEdit}
                className="px-6 py-3 border border-border text-text-secondary rounded-lg hover:bg-secondary-50 transition-smooth font-body font-body-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Saved Addresses */}
      {addresses?.length === 0 && !isAddingAddress ? (
        <div className="bg-surface rounded-lg shadow-soft p-12 text-center">
          <div className="w-24 h-24 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="MapPin" size={32} className="text-secondary-400" />
          </div>
          <h3 className="text-lg font-heading font-heading-medium text-text-primary mb-2">
            No saved addresses
          </h3>
          <p className="text-text-secondary font-body mb-6">
            Add your delivery addresses for faster checkout
          </p>
          <button
            onClick={handleAddAddress}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-700 transition-smooth font-body font-body-medium"
          >
            Add Your First Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {addresses?.map((address) => (
            <div key={address?.id} className={`bg-surface rounded-lg shadow-soft p-6 border-2 transition-smooth ${
              address?.isDefault ? 'border-primary' : 'border-border'
            }`}>
              {/* Address Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Icon name={getAddressTypeIcon(address?.type)} size={20} className="text-primary" />
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-heading font-heading-medium text-text-primary">
                        {address?.label}
                      </h3>
                      {address?.isDefault && (
                        <span className="px-2 py-1 bg-primary text-white text-xs font-body font-body-medium rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-text-secondary font-body capitalize">{address?.type}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEditAddress(address)}
                    disabled={editingAddress || isAddingAddress}
                    className="p-2 text-text-secondary hover:text-primary transition-smooth"
                  >
                    <Icon name="Edit" size={18} />
                  </button>
                  
                  <button
                    onClick={() => handleDeleteAddress(address?.id)}
                    disabled={isLoading || editingAddress || isAddingAddress}
                    className="p-2 text-text-secondary hover:text-error transition-smooth"
                  >
                    <Icon name="Trash2" size={18} />
                  </button>
                </div>
              </div>

              {/* Address Details */}
              <div className="space-y-2 mb-4">
                <p className="font-body text-text-primary">
                  {formatAddress(address)}
                </p>
                
                {address?.deliveryInstructions && (
                  <div className="p-3 bg-secondary-50 rounded-lg">
                    <p className="text-sm text-text-secondary font-body">
                      <span className="font-body-medium">Delivery Instructions:</span> {address?.deliveryInstructions}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              {!address?.isDefault && (
                <button
                  onClick={() => handleSetDefault(address?.id)}
                  disabled={isLoading || editingAddress || isAddingAddress}
                  className="w-full py-2 px-4 border border-primary text-primary rounded-lg hover:bg-primary-50 transition-smooth font-body font-body-medium"
                >
                  Set as Default
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AddressesSection;