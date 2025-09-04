import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

function CustomerNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartItemCount] = useState(3); // This would come from cart context in real app
  const [isLoggedIn] = useState(false); // This would come from auth context in real app
  const location = useLocation();

  const navigationItems = [
    { label: 'Menu', path: '/menu-browse-search', icon: 'ChefHat' },
    { label: 'Orders', path: '/order-tracking-status', icon: 'Clock' },
    { label: 'Account', path: '/customer-account-order-history', icon: 'User' },
  ];

  const isActivePath = (path) => location.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-navigation bg-surface shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/menu-browse-search" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="ChefHat" size={20} color="white" />
            </div>
            <span className="text-xl font-heading font-heading-medium text-text-primary">
              TasteBite
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-smooth font-body font-body-medium ${
                  isActivePath(item.path)
                    ? 'text-primary bg-primary-50' :'text-text-secondary hover:text-primary hover:bg-primary-50'
                }`}
              >
                <Icon name={item.icon} size={18} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            <Link
              to="/shopping-cart-checkout"
              className="relative p-2 text-text-secondary hover:text-primary transition-smooth"
            >
              <Icon name="ShoppingCart" size={24} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-body font-body-medium rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Auth Button */}
            {isLoggedIn ? (
              <Link
                to="/customer-account-order-history"
                className="hidden md:flex items-center space-x-2 px-4 py-2 text-text-secondary hover:text-primary transition-smooth"
              >
                <Icon name="User" size={18} />
                <span className="font-body font-body-medium">Profile</span>
              </Link>
            ) : (
              <Link
                to="/customer-login-register"
                className="hidden md:flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-smooth font-body font-body-medium"
              >
                <Icon name="LogIn" size={18} />
                <span>Sign In</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-text-secondary hover:text-primary transition-smooth"
            >
              <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-dropdown bg-surface shadow-floating">
          <nav className="px-4 py-6 space-y-4">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMobileMenu}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-smooth font-body font-body-medium min-h-touch ${
                  isActivePath(item.path)
                    ? 'text-primary bg-primary-50' :'text-text-secondary hover:text-primary hover:bg-primary-50'
                }`}
              >
                <Icon name={item.icon} size={20} />
                <span>{item.label}</span>
              </Link>
            ))}
            
            <div className="border-t border-border pt-4 mt-4">
              {isLoggedIn ? (
                <Link
                  to="/customer-account-order-history"
                  onClick={closeMobileMenu}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-text-secondary hover:text-primary hover:bg-primary-50 transition-smooth font-body font-body-medium min-h-touch"
                >
                  <Icon name="User" size={20} />
                  <span>Profile</span>
                </Link>
              ) : (
                <Link
                  to="/customer-login-register"
                  onClick={closeMobileMenu}
                  className="flex items-center space-x-3 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-700 transition-smooth font-body font-body-medium min-h-touch"
                >
                  <Icon name="LogIn" size={20} />
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default CustomerNavigation;