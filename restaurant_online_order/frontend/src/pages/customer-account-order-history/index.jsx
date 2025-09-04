// src/pages/customer-account-order-history/index.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerNavigation from 'components/ui/CustomerNavigation';
import Icon from 'components/AppIcon';

import ProfileSection from './components/ProfileSection';
import OrderHistorySection from './components/OrderHistorySection';
import LoyaltyRewardsSection from './components/LoyaltyRewardsSection';
import AddressesSection from './components/AddressesSection';
import PaymentMethodsSection from './components/PaymentMethodsSection';

function CustomerAccountOrderHistory() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1990-05-15',
    dietaryPreferences: ['vegetarian'],
    notifications: {
      email: true,
      sms: false,
      push: true
    }
  });
  const [loyaltyData, setLoyaltyData] = useState({
    points: 2450,
    tier: 'Gold',
    nextTierPoints: 550,
    availableRewards: 12
  });
  const navigate = useNavigate();

  const tabs = [
    { id: 'profile', label: 'Profile', icon: 'User' },
    { id: 'orders', label: 'Orders', icon: 'Package' },
    { id: 'rewards', label: 'Rewards', icon: 'Award' },
    { id: 'addresses', label: 'Addresses', icon: 'MapPin' },
    { id: 'payments', label: 'Payments', icon: 'CreditCard' }
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  const renderActiveSection = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <ProfileSection 
            userProfile={userProfile}
            setUserProfile={setUserProfile}
          />
        );
      case 'orders':
        return <OrderHistorySection />;
      case 'rewards':
        return (
          <LoyaltyRewardsSection 
            loyaltyData={loyaltyData}
            setLoyaltyData={setLoyaltyData}
          />
        );
      case 'addresses':
        return <AddressesSection />;
      case 'payments':
        return <PaymentMethodsSection />;
      default:
        return <ProfileSection userProfile={userProfile} setUserProfile={setUserProfile} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <CustomerNavigation />
      
      {/* Main Content */}
      <main className="pt-16">
        {/* Header Section */}
        <div className="bg-surface shadow-soft border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-heading font-heading-medium text-primary">
                    {userProfile?.firstName?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <h1 className="text-2xl font-heading font-heading-medium text-text-primary">
                    {userProfile?.firstName} {userProfile?.lastName}
                  </h1>
                  <p className="text-text-secondary font-body">
                    {userProfile?.email}
                  </p>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-1">
                      <Icon name="Award" size={16} className="text-warning-400" />
                      <span className="text-sm font-body text-text-secondary">
                        {loyaltyData?.tier} Member
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Star" size={16} className="text-primary" />
                      <span className="text-sm font-body text-text-secondary">
                        {loyaltyData?.points} Points
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Desktop Tab Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-text-secondary hover:text-primary transition-smooth"
              >
                <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={24} />
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex gap-6">
            {/* Desktop Sidebar Navigation */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <div className="bg-surface rounded-lg shadow-soft p-6 sticky top-32">
                <nav className="space-y-2">
                  {tabs?.map((tab) => (
                    <button
                      key={tab?.id}
                      onClick={() => handleTabChange(tab?.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-smooth font-body font-body-medium text-left ${
                        activeTab === tab?.id
                          ? 'bg-primary-50 text-primary border border-primary-100' :'text-text-secondary hover:text-primary hover:bg-primary-50'
                      }`}
                    >
                      <Icon name={tab?.icon} size={20} />
                      <span>{tab?.label}</span>
                    </button>
                  ))}
                </nav>
                
                {/* Quick Actions */}
                <div className="mt-8 pt-6 border-t border-border">
                  <h3 className="text-sm font-body font-body-medium text-text-primary mb-4">
                    Quick Actions
                  </h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => navigate('/menu-browse-search')}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-text-secondary hover:text-primary hover:bg-primary-50 rounded-lg transition-smooth font-body text-sm"
                    >
                      <Icon name="ShoppingBag" size={18} />
                      <span>Order Now</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-4 py-2 text-text-secondary hover:text-primary hover:bg-primary-50 rounded-lg transition-smooth font-body text-sm">
                      <Icon name="HeadphonesIcon" size={18} />
                      <span>Support</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1">
              {/* Mobile Tab Navigation */}
              <div className="lg:hidden mb-6">
                <div className="bg-surface rounded-lg shadow-soft">
                  <div className="p-4 border-b border-border">
                    <button
                      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                      className="w-full flex items-center justify-between py-2"
                    >
                      <div className="flex items-center space-x-3">
                        <Icon name={tabs?.find(t => t?.id === activeTab)?.icon} size={20} className="text-primary" />
                        <span className="font-body font-body-medium text-text-primary">
                          {tabs?.find(t => t?.id === activeTab)?.label}
                        </span>
                      </div>
                      <Icon 
                        name={isMobileMenuOpen ? "ChevronUp" : "ChevronDown"} 
                        size={20} 
                        className="text-text-secondary" 
                      />
                    </button>
                  </div>
                  
                  {isMobileMenuOpen && (
                    <div className="p-2">
                      {tabs?.map((tab) => (
                        <button
                          key={tab?.id}
                          onClick={() => handleTabChange(tab?.id)}
                          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-smooth font-body font-body-medium text-left min-h-touch ${
                            activeTab === tab?.id
                              ? 'bg-primary-50 text-primary' :'text-text-secondary hover:text-primary hover:bg-primary-50'
                          }`}
                        >
                          <Icon name={tab?.icon} size={20} />
                          <span>{tab?.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Active Section Content */}
              {renderActiveSection()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CustomerAccountOrderHistory;