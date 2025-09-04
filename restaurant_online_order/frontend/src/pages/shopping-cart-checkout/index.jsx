import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CustomerNavigation from 'components/ui/CustomerNavigation';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

function ShoppingCartCheckout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [promoMessage, setPromoMessage] = useState('');
  const [fulfillmentType, setFulfillmentType] = useState('delivery'); // 'delivery' or 'pickup'
  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [loyaltyPoints, setLoyaltyPoints] = useState(1250);
  const [usePoints, setUsePoints] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});

  // Mock data
  const mockCartItems = [
    {
      id: 1,
      name: "Margherita Pizza",
      image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=300&h=200&fit=crop",
      price: 18.99,
      quantity: 2,
      customizations: ["Large Size", "Extra Cheese", "Thin Crust"],
      allergens: ["Gluten", "Dairy"],
      prepTime: 15
    },
    {
      id: 2,
      name: "Caesar Salad",
      image: "https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg?w=300&h=200&fit=crop",
      price: 12.50,
      quantity: 1,
      customizations: ["No Croutons", "Extra Dressing"],
      allergens: ["Dairy", "Eggs"],
      prepTime: 8
    },
    {
      id: 3,
      name: "Chocolate Brownie",
      image: "https://images.pixabay.com/photo/2017/01/11/11/33/cake-1971552_1280.jpg?w=300&h=200&fit=crop",
      price: 8.75,
      quantity: 1,
      customizations: ["With Ice Cream", "Extra Chocolate Sauce"],
      allergens: ["Gluten", "Dairy", "Nuts"],
      prepTime: 5
    }
  ];

  const savedAddresses = [
    {
      id: 1,
      label: "Home",
      address: "123 Main Street, Apt 4B, Downtown, City 12345",
      isDefault: true
    },
    {
      id: 2,
      label: "Office",
      address: "456 Business Ave, Suite 200, Business District, City 12346",
      isDefault: false
    }
  ];

  const timeSlots = [
    { id: 1, time: "ASAP (25-35 min)", available: true },
    { id: 2, time: "6:30 PM", available: true },
    { id: 3, time: "7:00 PM", available: true },
    { id: 4, time: "7:30 PM", available: false },
    { id: 5, time: "8:00 PM", available: true }
  ];

  const paymentMethods = [
    { id: 'stripe', name: 'Credit/Debit Card', icon: 'CreditCard' },
    { id: 'razorpay', name: 'UPI/Wallet', icon: 'Smartphone' },
    { id: 'cod', name: 'Cash on Delivery', icon: 'Banknote' }
  ];

  useEffect(() => {
    setCartItems(mockCartItems);
    setSelectedAddress(savedAddresses[0].id);
    setSelectedTimeSlot(timeSlots[0].id);
    setPaymentMethod(paymentMethods[0].id);
  }, []);

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      setCartItems(cartItems.filter(item => item.id !== itemId));
    } else {
      setCartItems(cartItems.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const toggleItemExpansion = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === 'save10') {
      setPromoMessage('Promo code applied! 10% discount added.');
    } else if (promoCode.toLowerCase() === 'welcome20') {
      setPromoMessage('Welcome offer applied! 20% discount added.');
    } else {
      setPromoMessage('Invalid promo code. Please try again.');
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateDiscount = () => {
    if (promoMessage.includes('10%')) return calculateSubtotal() * 0.1;
    if (promoMessage.includes('20%')) return calculateSubtotal() * 0.2;
    return 0;
  };

  const calculateTax = () => {
    return (calculateSubtotal() - calculateDiscount()) * 0.08;
  };

  const calculateDeliveryFee = () => {
    return fulfillmentType === 'delivery' ? 3.99 : 0;
  };

  const calculatePointsDiscount = () => {
    return usePoints ? Math.min(loyaltyPoints * 0.01, calculateSubtotal() * 0.2) : 0;
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount() + calculateTax() + calculateDeliveryFee() - calculatePointsDiscount();
  };

  const getEstimatedPrepTime = () => {
    const maxPrepTime = Math.max(...cartItems.map(item => item.prepTime));
    const kitchenLoad = 1.2; // Mock ML prediction factor
    return Math.ceil(maxPrepTime * kitchenLoad);
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;
    
    setIsLoading(true);
    
    try {
      // Simulate order placement
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to order tracking
      navigate('/order-tracking-status', { 
        state: { 
          orderId: 'ORD-' + Date.now(),
          total: calculateTotal().toFixed(2)
        }
      });
    } catch (error) {
      console.error('Order placement failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const minimumOrderValue = 15.00;
  const isMinimumMet = calculateSubtotal() >= minimumOrderValue;

  return (
    <div className="min-h-screen bg-background">
      <CustomerNavigation />
      
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <Link 
                to="/menu-browse-search"
                className="p-2 text-text-secondary hover:text-primary transition-smooth"
              >
                <Icon name="ArrowLeft" size={24} />
              </Link>
              <div>
                <h1 className="text-3xl font-heading font-heading-medium text-text-primary">
                  Shopping Cart
                </h1>
                <p className="text-text-secondary font-body">
                  Review your order and proceed to checkout
                </p>
              </div>
            </div>
          </div>

          {cartItems.length === 0 ? (
            /* Empty Cart State */
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="ShoppingCart" size={48} className="text-secondary" />
              </div>
              <h2 className="text-2xl font-heading font-heading-medium text-text-primary mb-4">
                Your cart is empty
              </h2>
              <p className="text-text-secondary font-body mb-8">
                Add some delicious items to get started
              </p>
              <Link
                to="/menu-browse-search"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-700 transition-smooth font-body font-body-medium"
              >
                <Icon name="ChefHat" size={20} />
                <span>Browse Menu</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                {/* Minimum Order Notice */}
                {!isMinimumMet && (
                  <div className="p-4 bg-warning-50 border border-warning-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Icon name="AlertCircle" size={20} className="text-warning-600" />
                      <p className="text-warning-700 font-body font-body-medium">
                        Add ${(minimumOrderValue - calculateSubtotal()).toFixed(2)} more to meet minimum order value
                      </p>
                    </div>
                  </div>
                )}

                {/* Cart Items List */}
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="bg-surface border border-border rounded-lg p-6 shadow-soft">
                      <div className="flex items-start space-x-4">
                        {/* Item Image */}
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Item Details */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-heading font-heading-medium text-text-primary">
                                {item.name}
                              </h3>
                              <p className="text-primary font-body font-body-medium">
                                ${item.price.toFixed(2)} each
                              </p>
                            </div>
                            
                            {/* Quantity Controls */}
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center border border-border rounded-lg hover:bg-secondary-50 transition-smooth"
                              >
                                <Icon name="Minus" size={16} />
                              </button>
                              <span className="font-data font-data-normal text-lg w-8 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center border border-border rounded-lg hover:bg-secondary-50 transition-smooth"
                              >
                                <Icon name="Plus" size={16} />
                              </button>
                            </div>
                          </div>

                          {/* Customizations Toggle */}
                          {item.customizations.length > 0 && (
                            <button
                              onClick={() => toggleItemExpansion(item.id)}
                              className="flex items-center space-x-2 mt-2 text-sm text-text-secondary hover:text-primary transition-smooth"
                            >
                              <Icon 
                                name={expandedItems[item.id] ? "ChevronUp" : "ChevronDown"} 
                                size={16} 
                              />
                              <span>Customizations ({item.customizations.length})</span>
                            </button>
                          )}

                          {/* Expanded Customizations */}
                          {expandedItems[item.id] && (
                            <div className="mt-3 space-y-2">
                              <div className="flex flex-wrap gap-2">
                                {item.customizations.map((customization, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-primary-50 text-primary text-sm rounded-md font-body"
                                  >
                                    {customization}
                                  </span>
                                ))}
                              </div>
                              
                              {/* Allergens */}
                              {item.allergens.length > 0 && (
                                <div className="flex items-center space-x-2">
                                  <Icon name="AlertTriangle" size={16} className="text-warning-600" />
                                  <span className="text-sm text-text-secondary font-body">
                                    Contains: {item.allergens.join(', ')}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Item Actions */}
                          <div className="flex items-center justify-between mt-4">
                            <Link
                              to="/item-detail-customization"
                              state={{ item }}
                              className="text-sm text-primary hover:text-primary-700 font-body-medium transition-smooth"
                            >
                              Modify Item
                            </Link>
                            <div className="flex items-center space-x-4">
                              <span className="text-lg font-heading font-heading-medium text-text-primary">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, 0)}
                                className="p-1 text-error hover:bg-error-50 rounded transition-smooth"
                              >
                                <Icon name="Trash2" size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Promo Code */}
                <div className="bg-surface border border-border rounded-lg p-6 shadow-soft">
                  <h3 className="text-lg font-heading font-heading-medium text-text-primary mb-4">
                    Promo Code
                  </h3>
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter promo code"
                      className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-body"
                    />
                    <button
                      onClick={applyPromoCode}
                      className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-smooth font-body font-body-medium"
                    >
                      Apply
                    </button>
                  </div>
                  {promoMessage && (
                    <p className={`mt-2 text-sm font-body ${
                      promoMessage.includes('Invalid') ? 'text-error' : 'text-success'
                    }`}>
                      {promoMessage}
                    </p>
                  )}
                </div>
              </div>

              {/* Order Summary & Checkout */}
              <div className="space-y-6">
                {/* Fulfillment Type */}
                <div className="bg-surface border border-border rounded-lg p-6 shadow-soft">
                  <h3 className="text-lg font-heading font-heading-medium text-text-primary mb-4">
                    Fulfillment
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setFulfillmentType('delivery')}
                      className={`p-3 border rounded-lg transition-smooth font-body font-body-medium ${
                        fulfillmentType === 'delivery' ?'border-primary bg-primary-50 text-primary' :'border-border hover:border-primary hover:bg-primary-50'
                      }`}
                    >
                      <Icon name="Truck" size={20} className="mx-auto mb-1" />
                      <div className="text-sm">Delivery</div>
                    </button>
                    <button
                      onClick={() => setFulfillmentType('pickup')}
                      className={`p-3 border rounded-lg transition-smooth font-body font-body-medium ${
                        fulfillmentType === 'pickup' ?'border-primary bg-primary-50 text-primary' :'border-border hover:border-primary hover:bg-primary-50'
                      }`}
                    >
                      <Icon name="Store" size={20} className="mx-auto mb-1" />
                      <div className="text-sm">Pickup</div>
                    </button>
                  </div>
                </div>

                {/* Address Selection (for delivery) */}
                {fulfillmentType === 'delivery' && (
                  <div className="bg-surface border border-border rounded-lg p-6 shadow-soft">
                    <h3 className="text-lg font-heading font-heading-medium text-text-primary mb-4">
                      Delivery Address
                    </h3>
                    <select
                      value={selectedAddress}
                      onChange={(e) => setSelectedAddress(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-body"
                    >
                      {savedAddresses.map((address) => (
                        <option key={address.id} value={address.id}>
                          {address.label} - {address.address}
                        </option>
                      ))}
                    </select>
                    <button className="mt-3 text-sm text-primary hover:text-primary-700 font-body-medium transition-smooth">
                      + Add New Address
                    </button>
                  </div>
                )}

                {/* Time Slot */}
                <div className="bg-surface border border-border rounded-lg p-6 shadow-soft">
                  <h3 className="text-lg font-heading font-heading-medium text-text-primary mb-4">
                    {fulfillmentType === 'delivery' ? 'Delivery Time' : 'Pickup Time'}
                  </h3>
                  <div className="space-y-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => slot.available && setSelectedTimeSlot(slot.id)}
                        disabled={!slot.available}
                        className={`w-full p-3 border rounded-lg text-left transition-smooth font-body ${
                          selectedTimeSlot === slot.id
                            ? 'border-primary bg-primary-50 text-primary'
                            : slot.available
                              ? 'border-border hover:border-primary hover:bg-primary-50' :'border-border bg-secondary-50 text-text-secondary cursor-not-allowed'
                        }`}
                      >
                        {slot.time}
                        {!slot.available && (
                          <span className="text-xs text-error ml-2">(Unavailable)</span>
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-accent-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Icon name="Clock" size={16} className="text-accent" />
                      <span className="text-sm text-accent-700 font-body">
                        Estimated prep time: {getEstimatedPrepTime()} minutes
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-surface border border-border rounded-lg p-6 shadow-soft">
                  <h3 className="text-lg font-heading font-heading-medium text-text-primary mb-4">
                    Payment Method
                  </h3>
                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`w-full flex items-center space-x-3 p-3 border rounded-lg transition-smooth font-body ${
                          paymentMethod === method.id
                            ? 'border-primary bg-primary-50 text-primary' :'border-border hover:border-primary hover:bg-primary-50'
                        }`}
                      >
                        <Icon name={method.icon} size={20} />
                        <span>{method.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Loyalty Points */}
                <div className="bg-surface border border-border rounded-lg p-6 shadow-soft">
                  <h3 className="text-lg font-heading font-heading-medium text-text-primary mb-4">
                    Loyalty Points
                  </h3>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-text-secondary font-body">Available Points:</span>
                    <span className="font-data font-data-normal text-lg text-primary">
                      {loyaltyPoints}
                    </span>
                  </div>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={usePoints}
                      onChange={(e) => setUsePoints(e.target.checked)}
                      className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                    />
                    <span className="text-sm font-body">
                      Use points (Save ${calculatePointsDiscount().toFixed(2)})
                    </span>
                  </label>
                </div>

                {/* Order Notes */}
                <div className="bg-surface border border-border rounded-lg p-6 shadow-soft">
                  <h3 className="text-lg font-heading font-heading-medium text-text-primary mb-4">
                    Special Instructions
                  </h3>
                  <textarea
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="Any special delivery instructions..."
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-body resize-none"
                  />
                </div>

                {/* Order Summary */}
                <div className="bg-surface border border-border rounded-lg p-6 shadow-soft">
                  <h3 className="text-lg font-heading font-heading-medium text-text-primary mb-4">
                    Order Summary
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-text-secondary font-body">Subtotal</span>
                      <span className="font-data font-data-normal">${calculateSubtotal().toFixed(2)}</span>
                    </div>
                    
                    {calculateDiscount() > 0 && (
                      <div className="flex justify-between text-success">
                        <span className="font-body">Discount</span>
                        <span className="font-data font-data-normal">-${calculateDiscount().toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span className="text-text-secondary font-body">Tax</span>
                      <span className="font-data font-data-normal">${calculateTax().toFixed(2)}</span>
                    </div>
                    
                    {fulfillmentType === 'delivery' && (
                      <div className="flex justify-between">
                        <span className="text-text-secondary font-body">Delivery Fee</span>
                        <span className="font-data font-data-normal">${calculateDeliveryFee().toFixed(2)}</span>
                      </div>
                    )}
                    
                    {usePoints && calculatePointsDiscount() > 0 && (
                      <div className="flex justify-between text-success">
                        <span className="font-body">Points Discount</span>
                        <span className="font-data font-data-normal">-${calculatePointsDiscount().toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="border-t border-border pt-3">
                      <div className="flex justify-between">
                        <span className="text-lg font-heading font-heading-medium text-text-primary">Total</span>
                        <span className="text-lg font-heading font-heading-medium text-primary">
                          ${calculateTotal().toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={!isMinimumMet || isLoading}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-primary text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-smooth font-body font-body-medium text-lg"
                >
                  {isLoading && <Icon name="Loader2" size={20} className="animate-spin" />}
                  <span>
                    {isLoading ? 'Placing Order...' : `Place Order • $${calculateTotal().toFixed(2)}`}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShoppingCartCheckout;