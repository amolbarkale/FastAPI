import React from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';

function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
            <Icon name="ChefHat" size={32} color="white" />
          </div>
        </div>

        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-8xl font-heading font-heading-bold text-primary mb-4">404</div>
          <div className="w-32 h-32 mx-auto bg-primary-50 rounded-full flex items-center justify-center mb-6">
            <Icon name="Search" size={48} className="text-primary" />
          </div>
        </div>

        {/* Content */}
        <div className="mb-8">
          <h1 className="text-2xl font-heading font-heading-medium text-text-primary mb-4">
            Page Not Found
          </h1>
          <p className="text-text-secondary font-body mb-6">
            Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <Link
            to="/menu-browse-search"
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-700 transition-smooth font-body font-body-medium"
          >
            <Icon name="Home" size={20} />
            <span>Go to Menu</span>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 border border-border text-text-secondary hover:text-primary hover:border-primary rounded-lg transition-smooth font-body font-body-medium"
          >
            <Icon name="ArrowLeft" size={20} />
            <span>Go Back</span>
          </button>
        </div>

        {/* Help Links */}
        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-sm text-text-secondary font-body mb-4">
            Need help? Try these popular pages:
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link
              to="/menu-browse-search"
              className="text-primary hover:text-primary-700 font-body-medium transition-smooth"
            >
              Browse Menu
            </Link>
            <Link
              to="/order-tracking-status"
              className="text-primary hover:text-primary-700 font-body-medium transition-smooth"
            >
              Track Order
            </Link>
            <Link
              to="/customer-account-order-history"
              className="text-primary hover:text-primary-700 font-body-medium transition-smooth"
            >
              My Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;