// src/pages/customer-account-order-history/components/PaymentMethodsSection.jsx
import React, { useState } from 'react';
import Icon from 'components/AppIcon';

function PaymentMethodsSection() {
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: 'credit',
      brand: 'visa',
      last4: '4242',
      expiryMonth: '12',
      expiryYear: '2027',
      holderName: 'John Doe',
      isDefault: true,
      nickname: 'Personal Visa'
    },
    {
      id: 2,
      type: 'credit',
      brand: 'mastercard',
      last4: '8765',
      expiryMonth: '09',
      expiryYear: '2026',
      holderName: 'John Doe',
      isDefault: false,
      nickname: 'Business Card'
    },
    {
      id: 3,
      type: 'paypal',
      email: 'john.doe@example.com',
      isDefault: false
    }
  ]);
  
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [cardForm, setCardForm] = useState({
    type: 'credit',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    holderName: '',
    nickname: '',
    saveCard: true
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showCvv, setShowCvv] = useState(false);

  const cardBrands = {
    visa: { name: 'Visa', icon: 'CreditCard', color: 'text-blue-600' },
    mastercard: { name: 'Mastercard', icon: 'CreditCard', color: 'text-red-600' },
    amex: { name: 'American Express', icon: 'CreditCard', color: 'text-green-600' },
    discover: { name: 'Discover', icon: 'CreditCard', color: 'text-orange-600' }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear + i);
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));

  const detectCardBrand = (number) => {
    const patterns = {
      visa: /^4/,
      mastercard: /^5[1-5]/,
      amex: /^3[47]/,
      discover: /^6(?:011|5)/
    };
    
    for (const [brand, pattern] of Object.entries(patterns)) {
      if (pattern.test(number)) {
        return brand;
      }
    }
    return 'unknown';
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    let processedValue = value;
    if (name === 'cardNumber') {
      processedValue = formatCardNumber(value);
    } else if (name === 'cvv') {
      processedValue = value.replace(/\D/g, '').slice(0, 4);
    } else if (name === 'holderName') {
      processedValue = value.replace(/[^a-zA-Z\s]/g, '');
    }
    
    setCardForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : processedValue
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
    const cardNumber = cardForm?.cardNumber?.replace(/\s/g, '');

    if (!cardForm?.holderName?.trim()) {
      newErrors.holderName = 'Cardholder name is required';
    }
    
    if (!cardNumber) {
      newErrors.cardNumber = 'Card number is required';
    } else if (cardNumber.length < 13 || cardNumber.length > 19) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }
    
    if (!cardForm?.expiryMonth) {
      newErrors.expiryMonth = 'Expiry month is required';
    }
    
    if (!cardForm?.expiryYear) {
      newErrors.expiryYear = 'Expiry year is required';
    } else {
      const currentDate = new Date();
      const expiryDate = new Date(parseInt(cardForm?.expiryYear), parseInt(cardForm?.expiryMonth) - 1);
      if (expiryDate <= currentDate) {
        newErrors.expiryYear = 'Card has expired';
      }
    }
    
    if (!cardForm?.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (cardForm?.cvv?.length < 3) {
      newErrors.cvv = 'CVV must be at least 3 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddCard = () => {
    setCardForm({
      type: 'credit',
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      holderName: '',
      nickname: '',
      saveCard: true
    });
    setErrors({});
    setIsAddingCard(true);
  };

  const handleEditCard = (card) => {
    if (card?.type === 'credit') {
      setCardForm({
        ...card,
        cardNumber: `•••• •••• •••• ${card?.last4}`,
        cvv: '',
        saveCard: true
      });
    }
    setErrors({});
    setEditingCard(card?.id);
  };

  const handleSaveCard = async () => {
    if (cardForm?.type === 'credit' && !validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (editingCard) {
        setPaymentMethods(prev => prev?.map(method => 
          method?.id === editingCard 
            ? { 
                ...method, 
                holderName: cardForm?.holderName,
                nickname: cardForm?.nickname,
                expiryMonth: cardForm?.expiryMonth,
                expiryYear: cardForm?.expiryYear
              }
            : method
        ));
        setEditingCard(null);
      } else {
        const cardNumber = cardForm?.cardNumber?.replace(/\s/g, '');
        const brand = detectCardBrand(cardNumber);
        
        const newCard = {
          id: Date.now(),
          type: cardForm?.type,
          brand,
          last4: cardNumber?.slice(-4),
          expiryMonth: cardForm?.expiryMonth,
          expiryYear: cardForm?.expiryYear,
          holderName: cardForm?.holderName,
          nickname: cardForm?.nickname || `${cardBrands[brand]?.name || 'Card'} ending in ${cardNumber?.slice(-4)}`,
          isDefault: paymentMethods?.length === 0
        };
        
        setPaymentMethods(prev => [...prev, newCard]);
        setIsAddingCard(false);
      }
      
      setCardForm({
        type: 'credit',
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        holderName: '',
        nickname: '',
        saveCard: true
      });
    } catch (error) {
      console.error('Failed to save payment method:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsAddingCard(false);
    setEditingCard(null);
    setCardForm({
      type: 'credit',
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      holderName: '',
      nickname: '',
      saveCard: true
    });
    setErrors({});
  };

  const handleDeleteCard = async (cardId) => {
    if (!confirm('Are you sure you want to remove this payment method?')) {
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setPaymentMethods(prev => prev?.filter(method => method?.id !== cardId));
    } catch (error) {
      console.error('Failed to delete payment method:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetDefault = async (cardId) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setPaymentMethods(prev => prev?.map(method => ({
        ...method,
        isDefault: method?.id === cardId
      })));
    } catch (error) {
      console.error('Failed to set default payment method:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCardIcon = (method) => {
    if (method?.type === 'paypal') {
      return 'Wallet';
    }
    return cardBrands[method?.brand]?.icon || 'CreditCard';
  };

  const getCardColor = (method) => {
    if (method?.type === 'paypal') {
      return 'text-blue-600';
    }
    return cardBrands[method?.brand]?.color || 'text-text-secondary';
  };

  const formatCardDisplay = (method) => {
    if (method?.type === 'paypal') {
      return method?.email;
    }
    return `•••• •••• •••• ${method?.last4}`;
  };

  const handleConnectPayPal = async () => {
    setIsLoading(true);
    try {
      // Simulate PayPal connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newPayPal = {
        id: Date.now(),
        type: 'paypal',
        email: 'john.doe@example.com',
        isDefault: paymentMethods?.length === 0
      };
      
      setPaymentMethods(prev => [...prev, newPayPal]);
    } catch (error) {
      console.error('Failed to connect PayPal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-heading font-heading-medium text-text-primary">
            Payment Methods
          </h2>
          <p className="text-text-secondary font-body mt-1">
            Manage your saved payment methods for quick and secure checkout
          </p>
        </div>
      </div>

      {/* Add Payment Method Buttons */}
      {!isAddingCard && !editingCard && (
        <div className="bg-surface rounded-lg shadow-soft p-6">
          <h3 className="text-lg font-heading font-heading-medium text-text-primary mb-4">
            Add Payment Method
          </h3>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAddCard}
              className="flex items-center justify-center space-x-3 px-6 py-4 border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-primary-50 transition-smooth font-body font-body-medium"
            >
              <Icon name="CreditCard" size={20} className="text-text-secondary" />
              <span>Add Credit/Debit Card</span>
            </button>
            
            <button
              onClick={handleConnectPayPal}
              disabled={isLoading || paymentMethods?.some(m => m?.type === 'paypal')}
              className="flex items-center justify-center space-x-3 px-6 py-4 border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-primary-50 transition-smooth font-body font-body-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Icon name="Loader2" size={20} className="animate-spin text-text-secondary" />
              ) : (
                <Icon name="Wallet" size={20} className="text-text-secondary" />
              )}
              <span>
                {paymentMethods?.some(m => m?.type === 'paypal') ? 'PayPal Connected' : 'Connect PayPal'}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Card Form */}
      {(isAddingCard || editingCard) && (
        <div className="bg-surface rounded-lg shadow-soft p-6">
          <h3 className="text-lg font-heading font-heading-medium text-text-primary mb-6">
            {editingCard ? 'Edit Payment Method' : 'Add Credit/Debit Card'}
          </h3>
          
          <div className="space-y-4">
            {/* Cardholder Name */}
            <div>
              <label className="block text-sm font-body font-body-medium text-text-primary mb-2">
                Cardholder Name *
              </label>
              <input
                type="text"
                name="holderName"
                value={cardForm?.holderName}
                onChange={handleInputChange}
                className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth font-body ${
                  errors?.holderName ? 'border-error' : 'border-border'
                }`}
                placeholder="John Doe"
              />
              {errors?.holderName && (
                <p className="text-error text-sm font-body mt-1">{errors?.holderName}</p>
              )}
            </div>

            {/* Card Number */}
            <div>
              <label className="block text-sm font-body font-body-medium text-text-primary mb-2">
                Card Number *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="cardNumber"
                  value={cardForm?.cardNumber}
                  onChange={handleInputChange}
                  maxLength={19}
                  className={`w-full px-3 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth font-body ${
                    errors?.cardNumber ? 'border-error' : 'border-border'
                  }`}
                  placeholder="1234 5678 9012 3456"
                  disabled={editingCard}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Icon name="CreditCard" size={20} className="text-text-secondary" />
                </div>
              </div>
              {errors?.cardNumber && (
                <p className="text-error text-sm font-body mt-1">{errors?.cardNumber}</p>
              )}
            </div>

            {/* Expiry and CVV */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-body font-body-medium text-text-primary mb-2">
                  Expiry Month *
                </label>
                <select
                  name="expiryMonth"
                  value={cardForm?.expiryMonth}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth font-body ${
                    errors?.expiryMonth ? 'border-error' : 'border-border'
                  }`}
                >
                  <option value="">Month</option>
                  {months?.map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
                {errors?.expiryMonth && (
                  <p className="text-error text-sm font-body mt-1">{errors?.expiryMonth}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-body font-body-medium text-text-primary mb-2">
                  Expiry Year *
                </label>
                <select
                  name="expiryYear"
                  value={cardForm?.expiryYear}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth font-body ${
                    errors?.expiryYear ? 'border-error' : 'border-border'
                  }`}
                >
                  <option value="">Year</option>
                  {years?.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                {errors?.expiryYear && (
                  <p className="text-error text-sm font-body mt-1">{errors?.expiryYear}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-body font-body-medium text-text-primary mb-2">
                  CVV *
                </label>
                <div className="relative">
                  <input
                    type={showCvv ? 'text' : 'password'}
                    name="cvv"
                    value={cardForm?.cvv}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth font-body ${
                      errors?.cvv ? 'border-error' : 'border-border'
                    }`}
                    placeholder="123"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCvv(!showCvv)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-primary transition-smooth"
                  >
                    <Icon name={showCvv ? "EyeOff" : "Eye"} size={20} />
                  </button>
                </div>
                {errors?.cvv && (
                  <p className="text-error text-sm font-body mt-1">{errors?.cvv}</p>
                )}
              </div>
            </div>

            {/* Nickname */}
            <div>
              <label className="block text-sm font-body font-body-medium text-text-primary mb-2">
                Card Nickname (Optional)
              </label>
              <input
                type="text"
                name="nickname"
                value={cardForm?.nickname}
                onChange={handleInputChange}
                className="w-full px-3 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth font-body"
                placeholder="e.g., Personal Card, Business Card"
              />
            </div>

            {/* Security Notice */}
            <div className="p-4 bg-success-50 border border-success-100 rounded-lg">
              <div className="flex items-start space-x-3">
                <Icon name="Shield" size={20} className="text-success-600 mt-0.5" />
                <div>
                  <p className="text-sm font-body font-body-medium text-success-800">
                    Your payment information is secure
                  </p>
                  <p className="text-xs text-success-700 font-body mt-1">
                    We use industry-standard encryption to protect your payment details. Your card information is tokenized and never stored in plain text.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                onClick={handleSaveCard}
                disabled={isLoading}
                className="flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-smooth font-body font-body-medium"
              >
                {isLoading && <Icon name="Loader2" size={18} className="animate-spin" />}
                <span>{isLoading ? 'Saving...' : (editingCard ? 'Update Card' : 'Add Card')}</span>
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

      {/* Saved Payment Methods */}
      {paymentMethods?.length === 0 && !isAddingCard ? (
        <div className="bg-surface rounded-lg shadow-soft p-12 text-center">
          <div className="w-24 h-24 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="CreditCard" size={32} className="text-secondary-400" />
          </div>
          <h3 className="text-lg font-heading font-heading-medium text-text-primary mb-2">
            No payment methods saved
          </h3>
          <p className="text-text-secondary font-body mb-6">
            Add your payment methods for faster and more convenient checkout
          </p>
          <button
            onClick={handleAddCard}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-700 transition-smooth font-body font-body-medium"
          >
            Add Your First Card
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-heading font-heading-medium text-text-primary">
            Saved Payment Methods
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {paymentMethods?.map((method) => (
              <div key={method?.id} className={`bg-surface rounded-lg shadow-soft p-6 border-2 transition-smooth ${
                method?.isDefault ? 'border-primary' : 'border-border'
              }`}>
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
                      <Icon name={getCardIcon(method)} size={20} className={getCardColor(method)} />
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-heading font-heading-medium text-text-primary">
                          {method?.nickname || `${method?.type === 'paypal' ? 'PayPal' : cardBrands[method?.brand]?.name || 'Card'}`}
                        </h4>
                        {method?.isDefault && (
                          <span className="px-2 py-1 bg-primary text-white text-xs font-body font-body-medium rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-text-secondary font-body">
                        {formatCardDisplay(method)}
                      </p>
                      {method?.type === 'credit' && (
                        <p className="text-xs text-text-secondary font-body">
                          Expires {method?.expiryMonth}/{method?.expiryYear}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {method?.type === 'credit' && (
                      <button
                        onClick={() => handleEditCard(method)}
                        disabled={editingCard || isAddingCard}
                        className="p-2 text-text-secondary hover:text-primary transition-smooth"
                      >
                        <Icon name="Edit" size={18} />
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleDeleteCard(method?.id)}
                      disabled={isLoading || editingCard || isAddingCard}
                      className="p-2 text-text-secondary hover:text-error transition-smooth"
                    >
                      <Icon name="Trash2" size={18} />
                    </button>
                  </div>
                </div>

                {/* Actions */}
                {!method?.isDefault && (
                  <button
                    onClick={() => handleSetDefault(method?.id)}
                    disabled={isLoading || editingCard || isAddingCard}
                    className="w-full py-2 px-4 border border-primary text-primary rounded-lg hover:bg-primary-50 transition-smooth font-body font-body-medium"
                  >
                    Set as Default
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentMethodsSection;