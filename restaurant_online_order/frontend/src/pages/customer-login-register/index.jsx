import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

function CustomerLoginRegister() {
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    rememberMe: false,
    acceptTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // Mock credentials for testing
  const mockCredentials = {
    customer: { email: "customer@tastebite.com", password: "customer123" },
    admin: { email: "admin@tastebite.com", password: "admin123" },
    staff: { email: "staff@tastebite.com", password: "staff123" }
  };

  useEffect(() => {
    // Reset form when switching tabs
    setFormData({
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      rememberMe: false,
      acceptTerms: false
    });
    setErrors({});
    setPasswordStrength(0);
  }, [activeTab]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: inputValue
    }));

    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Calculate password strength for register mode
    if (name === 'password' && activeTab === 'register') {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    setPasswordStrength(strength);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 25) return 'bg-error';
    if (passwordStrength < 50) return 'bg-warning';
    if (passwordStrength < 75) return 'bg-accent';
    return 'bg-success';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return 'Weak';
    if (passwordStrength < 50) return 'Fair';
    if (passwordStrength < 75) return 'Good';
    return 'Strong';
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (activeTab === 'register') {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required';
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      if (!formData.acceptTerms) {
        newErrors.acceptTerms = 'Please accept the terms and conditions';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (activeTab === 'login') {
        // Check mock credentials
        const isValidCredentials = Object.values(mockCredentials).some(
          cred => cred.email === formData.email && cred.password === formData.password
        );

        if (!isValidCredentials) {
          setErrors({ 
            submit: `Invalid credentials. Try: ${mockCredentials.customer.email} / ${mockCredentials.customer.password}` 
          });
          setIsLoading(false);
          return;
        }
      }

      // Success - redirect to intended page or menu
      const redirectTo = location.state?.from || '/menu-browse-search';
      navigate(redirectTo);
    } catch (error) {
      setErrors({ submit: 'Authentication failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`${provider} login initiated`);
    // Simulate social login success
    setTimeout(() => {
      navigate('/menu-browse-search');
    }, 1000);
  };

  const handleGuestCheckout = () => {
    navigate('/shopping-cart-checkout');
  };

  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
    // In real app, this would open a modal or navigate to reset page
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/restaurants/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      localStorage.setItem("token", data.access_token); // Store the token
      navigate("/"); // Redirect to the home page
    } catch (error) {
      setErrors({ login: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("restaurants/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.firstName + " " + formData.lastName,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Registration failed");
      }

      setErrors({}); // Clear errors on success
      navigate("/customer-login-register"); // Redirect to login tab
    } catch (error) {
      setErrors({ register: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Minimal Header */}
      <header className="bg-surface shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/menu-browse-search" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="ChefHat" size={20} color="white" />
              </div>
              <span className="text-xl font-heading font-heading-medium text-text-primary">
                TasteBite
              </span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-3 py-2 text-text-secondary hover:text-primary transition-smooth">
                <Icon name="Globe" size={18} />
                <span className="text-sm font-body">EN</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Background Image - Desktop Only */}
        <div className="hidden lg:flex lg:w-1/2 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900 to-primary-700 opacity-90"></div>
          <Image
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Restaurant Interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className="text-center text-white">
              <h1 className="text-4xl font-heading font-heading-bold mb-6">
                Welcome to TasteBite
              </h1>
              <p className="text-xl font-body opacity-90 mb-8">
                Discover amazing flavors and enjoy seamless ordering experience
              </p>
              <div className="flex items-center justify-center space-x-8">
                <div className="text-center">
                  <div className="text-2xl font-heading font-heading-medium">500+</div>
                  <div className="text-sm opacity-80">Menu Items</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-heading font-heading-medium">50K+</div>
                  <div className="text-sm opacity-80">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-heading font-heading-medium">4.8★</div>
                  <div className="text-sm opacity-80">Average Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon name="ChefHat" size={32} color="white" />
              </div>
              <h1 className="text-2xl font-heading font-heading-medium text-text-primary">
                Welcome to TasteBite
              </h1>
              <p className="text-text-secondary font-body mt-2">
                Your favorite meals, just a click away
              </p>
            </div>

            {/* Tab Navigation */}
            <div className="flex bg-secondary-50 rounded-lg p-1 mb-8">
              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-3 px-4 rounded-md font-body font-body-medium transition-smooth ${
                  activeTab === 'login' ?'bg-surface text-primary shadow-soft' :'text-text-secondary hover:text-primary'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`flex-1 py-3 px-4 rounded-md font-body font-body-medium transition-smooth ${
                  activeTab === 'register' ?'bg-surface text-primary shadow-soft' :'text-text-secondary hover:text-primary'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Social Login */}
            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleSocialLogin('google')}
                className="w-full flex items-center justify-center space-x-3 px-4 py-3 border border-border rounded-lg hover:bg-secondary-50 transition-smooth font-body font-body-medium min-h-touch"
              >
                <Icon name="Chrome" size={20} className="text-text-secondary" />
                <span>Continue with Google</span>
              </button>
              <button
                onClick={() => handleSocialLogin('facebook')}
                className="w-full flex items-center justify-center space-x-3 px-4 py-3 border border-border rounded-lg hover:bg-secondary-50 transition-smooth font-body font-body-medium min-h-touch"
              >
                <Icon name="Facebook" size={20} className="text-text-secondary" />
                <span>Continue with Facebook</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-text-secondary font-body">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === 'register' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-body font-body-medium text-text-primary mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth font-body min-h-touch ${
                        errors.firstName ? 'border-error' : 'border-border'
                      }`}
                      placeholder="John"
                    />
                    {errors.firstName && (
                      <p className="text-error text-sm font-body mt-1">{errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-body font-body-medium text-text-primary mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth font-body min-h-touch ${
                        errors.lastName ? 'border-error' : 'border-border'
                      }`}
                      placeholder="Doe"
                    />
                    {errors.lastName && (
                      <p className="text-error text-sm font-body mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-body font-body-medium text-text-primary mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth font-body min-h-touch ${
                    errors.email ? 'border-error' : 'border-border'
                  }`}
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="text-error text-sm font-body mt-1">{errors.email}</p>
                )}
              </div>

              {activeTab === 'register' && (
                <div>
                  <label className="block text-sm font-body font-body-medium text-text-primary mb-2">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth font-body min-h-touch"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-body font-body-medium text-text-primary mb-2">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth font-body min-h-touch ${
                      errors.password ? 'border-error' : 'border-border'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-primary transition-smooth"
                  >
                    <Icon name={showPassword ? "EyeOff" : "Eye"} size={20} />
                  </button>
                </div>
                {errors.password && (
                  <p className="text-error text-sm font-body mt-1">{errors.password}</p>
                )}
                
                {activeTab === 'register' && formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="flex-1 bg-secondary-100 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                          style={{ width: `${passwordStrength}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-body text-text-secondary">
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {activeTab === 'register' && (
                <div>
                  <label className="block text-sm font-body font-body-medium text-text-primary mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth font-body min-h-touch ${
                        errors.confirmPassword ? 'border-error' : 'border-border'
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-primary transition-smooth"
                    >
                      <Icon name={showConfirmPassword ? "EyeOff" : "Eye"} size={20} />
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-error text-sm font-body mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              )}

              {/* Checkboxes */}
              <div className="space-y-3">
                {activeTab === 'login' && (
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
                    />
                    <span className="text-sm font-body text-text-secondary">
                      Remember me for 30 days
                    </span>
                  </label>
                )}

                {activeTab === 'register' && (
                  <label className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2 mt-0.5"
                    />
                    <span className="text-sm font-body text-text-secondary">
                      I agree to the{' '}
                      <button type="button" className="text-primary hover:text-primary-700 font-body-medium">
                        Terms of Service
                      </button>
                      {' '}and{' '}
                      <button type="button" className="text-primary hover:text-primary-700 font-body-medium">
                        Privacy Policy
                      </button>
                    </span>
                  </label>
                )}
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={handleForgotPassword}
                  className="text-sm text-primary hover:text-primary-700 font-body-medium transition-smooth"
                >
                  Forgot your password?
                </button>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  onClick={handleLogin}
                  className="w-full py-3 px-4 bg-primary text-white rounded-lg hover:bg-primary-700 transition-smooth font-body font-body-medium"
                >
                  Login
                </button>
              </div>
            </form>

            {/* Guest Checkout */}
            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-sm text-text-secondary font-body mb-3">
                Don't want to create an account?
              </p>
              <button
                onClick={handleGuestCheckout}
                className="text-sm text-primary hover:text-primary-700 font-body-medium transition-smooth"
              >
                Continue as guest
              </button>
            </div>

            {/* Mock Credentials Info */}
            <div className="mt-8 p-4 bg-accent-50 border border-accent-100 rounded-lg">
              <h4 className="text-sm font-body font-body-medium text-text-primary mb-2">
                Demo Credentials:
              </h4>
              <div className="text-xs font-data space-y-1 text-text-secondary">
                <div>Customer: {mockCredentials.customer.email} / {mockCredentials.customer.password}</div>
                <div>Admin: {mockCredentials.admin.email} / {mockCredentials.admin.password}</div>
                <div>Staff: {mockCredentials.staff.email} / {mockCredentials.staff.password}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerLoginRegister;