// src/pages/customer-account-order-history/components/LoyaltyRewardsSection.jsx
import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import { format, addDays } from 'date-fns';

function LoyaltyRewardsSection({ loyaltyData, setLoyaltyData }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isRedeeming, setIsRedeeming] = useState(false);

  // Mock rewards data
  const availableRewards = [
    {
      id: 1,
      title: 'Free Appetizer',
      description: 'Get any appetizer free with your next order',
      pointsCost: 500,
      image: 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?w=300&h=200&fit=crop',
      category: 'food',
      validUntil: addDays(new Date(), 30),
      termsAndConditions: 'Valid for appetizers up to $15. Cannot be combined with other offers.'
    },
    {
      id: 2,
      title: '20% Off Next Order',
      description: 'Save 20% on your entire next order',
      pointsCost: 750,
      image: 'https://images.pixabay.com/photo/2022/01/11/21/48/food-6931438_960_720.jpg?w=300&h=200&fit=crop',
      category: 'discount',
      validUntil: addDays(new Date(), 60),
      termsAndConditions: 'Maximum discount of $20. Valid on orders over $25.'
    },
    {
      id: 3,
      title: 'Free Dessert',
      description: 'Choose any dessert from our selection',
      pointsCost: 400,
      image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300&h=200&fit=crop',
      category: 'food',
      validUntil: addDays(new Date(), 45),
      termsAndConditions: 'Valid for desserts up to $12. One per order.'
    },
    {
      id: 4,
      title: 'Free Delivery for a Month',
      description: 'Enjoy free delivery on all orders for 30 days',
      pointsCost: 1500,
      image: 'https://images.pexels.com/photos/4393426/pexels-photo-4393426.jpeg?w=300&h=200&fit=crop',
      category: 'service',
      validUntil: addDays(new Date(), 90),
      termsAndConditions: 'Valid for 30 days from redemption date. No minimum order required.'
    },
    {
      id: 5,
      title: 'VIP Status Upgrade',
      description: 'Instant upgrade to VIP status for 3 months',
      pointsCost: 2000,
      image: 'https://images.pixabay.com/photo/2020/12/07/16/35/restaurant-5813046_960_720.jpg?w=300&h=200&fit=crop',
      category: 'status',
      validUntil: addDays(new Date(), 120),
      termsAndConditions: 'Includes priority support, exclusive offers, and faster delivery.'
    },
    {
      id: 6,
      title: 'Mystery Box Meal',
      description: "Chef\'s surprise meal worth $50",
      pointsCost: 1200,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
      category: 'special',
      validUntil: addDays(new Date(), 15),
      termsAndConditions: 'Meal selection based on chef recommendations and seasonal ingredients.'
    }
  ];

  // Mock points history
  const pointsHistory = [
    { date: new Date('2024-01-15'), type: 'earned', amount: 50, description: 'Order #ORD-2024-001', orderId: 'ORD-2024-001' },
    { date: new Date('2024-01-12'), type: 'redeemed', amount: -500, description: 'Free Appetizer Reward', rewardTitle: 'Free Appetizer' },
    { date: new Date('2024-01-10'), type: 'earned', amount: 40, description: 'Order #ORD-2024-003', orderId: 'ORD-2024-003' },
    { date: new Date('2024-01-08'), type: 'bonus', amount: 100, description: 'Weekly login bonus', bonus: true },
    { date: new Date('2024-01-05'), type: 'earned', amount: 60, description: 'Order #ORD-2024-004', orderId: 'ORD-2024-004' },
    { date: new Date('2024-01-02'), type: 'earned', amount: 35, description: 'Order #ORD-2024-005', orderId: 'ORD-2024-005' },
    { date: new Date('2023-12-28'), type: 'redeemed', amount: -750, description: '20% Off Discount', rewardTitle: '20% Off Next Order' },
    { date: new Date('2023-12-25'), type: 'bonus', amount: 250, description: 'Holiday bonus points', bonus: true }
  ];

  const tierInfo = {
    Bronze: { min: 0, max: 999, color: 'text-accent-600', bgColor: 'bg-accent-100' },
    Silver: { min: 1000, max: 2499, color: 'text-secondary-600', bgColor: 'bg-secondary-100' },
    Gold: { min: 2500, max: 4999, color: 'text-warning-500', bgColor: 'bg-warning-100' },
    Platinum: { min: 5000, max: 9999, color: 'text-primary-600', bgColor: 'bg-primary-100' },
    Diamond: { min: 10000, max: Infinity, color: 'text-accent-700', bgColor: 'bg-accent-200' }
  };

  const getNextTier = () => {
    const tiers = Object.keys(tierInfo);
    const currentIndex = tiers?.indexOf(loyaltyData?.tier);
    return currentIndex < tiers?.length - 1 ? tiers[currentIndex + 1] : null;
  };

  const getProgressPercentage = () => {
    const currentTierInfo = tierInfo[loyaltyData?.tier];
    const nextTier = getNextTier();
    
    if (!nextTier) return 100; // Diamond tier
    
    const nextTierInfo = tierInfo[nextTier];
    const progress = (loyaltyData?.points - currentTierInfo?.min) / (nextTierInfo?.min - currentTierInfo?.min) * 100;
    return Math.min(100, Math.max(0, progress));
  };

  const handleRedeemReward = async (reward) => {
    if (loyaltyData?.points < reward?.pointsCost) {
      return;
    }

    setIsRedeeming(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setLoyaltyData(prev => ({
        ...prev,
        points: prev?.points - reward?.pointsCost
      }));
      
      console.log('Reward redeemed:', reward?.title);
      // In real app, this would show success message and update user's rewards
    } catch (error) {
      console.error('Failed to redeem reward:', error);
    } finally {
      setIsRedeeming(false);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'food': return 'Utensils';
      case 'discount': return 'Percent';
      case 'service': return 'Truck';
      case 'status': return 'Crown';
      case 'special': return 'Gift';
      default: return 'Award';
    }
  };

  const getPointsIcon = (type) => {
    switch (type) {
      case 'earned': return 'Plus';
      case 'redeemed': return 'Minus';
      case 'bonus': return 'Star';
      default: return 'Circle';
    }
  };

  const getPointsColor = (type) => {
    switch (type) {
      case 'earned': return 'text-success-600';
      case 'redeemed': return 'text-error-600';
      case 'bonus': return 'text-accent-600';
      default: return 'text-text-secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Loyalty Overview */}
      <div className="bg-gradient-to-br from-primary to-primary-700 rounded-lg shadow-soft p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-heading font-heading-medium mb-2">
              Loyalty Rewards
            </h2>
            <p className="opacity-90 font-body">
              Earn points with every order and unlock amazing rewards
            </p>
          </div>
          
          <div className="text-right">
            <div className="text-3xl font-heading font-heading-bold">
              {loyaltyData?.points?.toLocaleString()}
            </div>
            <div className="text-sm opacity-90 font-body">Total Points</div>
          </div>
        </div>

        {/* Tier Progress */}
        <div className="bg-white bg-opacity-20 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Icon name="Award" size={20} />
              <span className="font-body font-body-medium">{loyaltyData?.tier} Member</span>
            </div>
            
            {getNextTier() && (
              <span className="text-sm opacity-90 font-body">
                {loyaltyData?.nextTierPoints} points to {getNextTier()}
              </span>
            )}
          </div>
          
          <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-500"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-surface rounded-lg shadow-soft">
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-4 px-6 font-body font-body-medium transition-smooth ${
              activeTab === 'overview' ?'text-primary border-b-2 border-primary' :'text-text-secondary hover:text-primary'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('rewards')}
            className={`flex-1 py-4 px-6 font-body font-body-medium transition-smooth ${
              activeTab === 'rewards' ?'text-primary border-b-2 border-primary' :'text-text-secondary hover:text-primary'
            }`}
          >
            Available Rewards
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-4 px-6 font-body font-body-medium transition-smooth ${
              activeTab === 'history' ?'text-primary border-b-2 border-primary' :'text-text-secondary hover:text-primary'
            }`}
          >
            Points History
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Tier Benefits */}
              <div>
                <h3 className="text-lg font-heading font-heading-medium text-text-primary mb-4">
                  {loyaltyData?.tier} Member Benefits
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3 p-4 border border-border rounded-lg">
                    <Icon name="Percent" size={24} className="text-primary" />
                    <div>
                      <p className="font-body font-body-medium text-text-primary">Earn Rate</p>
                      <p className="text-sm text-text-secondary font-body">2x points on orders</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 border border-border rounded-lg">
                    <Icon name="Gift" size={24} className="text-primary" />
                    <div>
                      <p className="font-body font-body-medium text-text-primary">Birthday Bonus</p>
                      <p className="text-sm text-text-secondary font-body">500 extra points</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 border border-border rounded-lg">
                    <Icon name="Truck" size={24} className="text-primary" />
                    <div>
                      <p className="font-body font-body-medium text-text-primary">Free Delivery</p>
                      <p className="text-sm text-text-secondary font-body">On orders over $25</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Referral Program */}
              <div className="bg-accent-50 border border-accent-100 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Icon name="Users" size={24} className="text-accent-600" />
                  <h3 className="text-lg font-heading font-heading-medium text-text-primary">
                    Refer Friends & Earn
                  </h3>
                </div>
                
                <p className="text-text-secondary font-body mb-4">
                  Invite friends to TasteBite and both of you get 500 bonus points when they place their first order!
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value="https://tastebite.com/ref/john-doe"
                    readOnly
                    className="flex-1 px-3 py-2 border border-accent-200 rounded-lg bg-white font-body text-sm"
                  />
                  <button className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-600 transition-smooth font-body font-body-medium">
                    Copy Link
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="text-lg font-heading font-heading-medium text-text-primary mb-4">
                  Recent Activity
                </h3>
                
                <div className="space-y-3">
                  {pointsHistory?.slice(0, 5)?.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          activity?.type === 'earned' ? 'bg-success-100' :
                          activity?.type === 'redeemed' ? 'bg-error-100' : 'bg-accent-100'
                        }`}>
                          <Icon name={getPointsIcon(activity?.type)} size={16} className={getPointsColor(activity?.type)} />
                        </div>
                        
                        <div>
                          <p className="font-body text-text-primary">{activity?.description}</p>
                          <p className="text-sm text-text-secondary font-body">
                            {format(activity?.date, 'MMM dd, yyyy')}
                          </p>
                        </div>
                      </div>
                      
                      <span className={`font-body font-body-medium ${
                        activity?.amount > 0 ? 'text-success-600' : 'text-error-600'
                      }`}>
                        {activity?.amount > 0 ? '+' : ''}{activity?.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rewards' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-heading font-heading-medium text-text-primary">
                  Available Rewards
                </h3>
                <span className="text-sm text-text-secondary font-body">
                  You have {loyaltyData?.points} points to spend
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableRewards?.map((reward) => (
                  <div key={reward?.id} className="bg-surface border border-border rounded-lg overflow-hidden shadow-soft hover:shadow-floating transition-smooth">
                    <div className="relative h-40">
                      <Image
                        src={reward?.image}
                        alt={reward?.title}
                        className="w-full h-full object-cover"
                      />
                      
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center space-x-1 px-2 py-1 bg-white bg-opacity-90 rounded-full text-xs font-body font-body-medium text-text-primary">
                          <Icon name={getCategoryIcon(reward?.category)} size={12} />
                          <span className="capitalize">{reward?.category}</span>
                        </span>
                      </div>
                      
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-1 bg-primary text-white rounded-full text-xs font-body font-body-medium">
                          {reward?.pointsCost} pts
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h4 className="font-heading font-heading-medium text-text-primary mb-2">
                        {reward?.title}
                      </h4>
                      <p className="text-sm text-text-secondary font-body mb-3">
                        {reward?.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-text-secondary font-body mb-4">
                        <span>Valid until {format(reward?.validUntil, 'MMM dd')}</span>
                        <span>{reward?.pointsCost} points</span>
                      </div>
                      
                      <button
                        onClick={() => handleRedeemReward(reward)}
                        disabled={loyaltyData?.points < reward?.pointsCost || isRedeeming}
                        className={`w-full py-2 px-4 rounded-lg font-body font-body-medium transition-smooth ${
                          loyaltyData?.points >= reward?.pointsCost
                            ? 'bg-primary text-white hover:bg-primary-700' :'bg-secondary-100 text-text-secondary cursor-not-allowed'
                        }`}
                      >
                        {isRedeeming ? 'Redeeming...' : 
                         loyaltyData?.points >= reward?.pointsCost ? 'Redeem Now' : 'Not Enough Points'}
                      </button>
                      
                      <details className="mt-3">
                        <summary className="text-xs text-primary cursor-pointer font-body">
                          Terms & Conditions
                        </summary>
                        <p className="text-xs text-text-secondary font-body mt-2 leading-relaxed">
                          {reward?.termsAndConditions}
                        </p>
                      </details>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              <h3 className="text-lg font-heading font-heading-medium text-text-primary mb-6">
                Points History
              </h3>
              
              <div className="space-y-3">
                {pointsHistory?.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity?.type === 'earned' ? 'bg-success-100' :
                        activity?.type === 'redeemed' ? 'bg-error-100' : 'bg-accent-100'
                      }`}>
                        <Icon name={getPointsIcon(activity?.type)} size={20} className={getPointsColor(activity?.type)} />
                      </div>
                      
                      <div>
                        <p className="font-body font-body-medium text-text-primary">{activity?.description}</p>
                        <p className="text-sm text-text-secondary font-body">
                          {format(activity?.date, 'MMM dd, yyyy • h:mm a')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className={`text-lg font-body font-body-medium ${
                        activity?.amount > 0 ? 'text-success-600' : 'text-error-600'
                      }`}>
                        {activity?.amount > 0 ? '+' : ''}{activity?.amount}
                      </span>
                      <p className="text-xs text-text-secondary font-body">
                        {activity?.type?.charAt(0)?.toUpperCase() + activity?.type?.slice(1)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoyaltyRewardsSection;