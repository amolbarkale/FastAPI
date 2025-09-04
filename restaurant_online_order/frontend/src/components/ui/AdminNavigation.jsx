import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

function AdminNavigation() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigationSections = [
    {
      title: 'Dashboard',
      items: [
        { label: 'Overview', path: '/restaurant-admin-dashboard', icon: 'BarChart3' },
        { label: 'Analytics', path: '/analytics', icon: 'TrendingUp' },
        { label: 'Reports', path: '/reports', icon: 'FileText' },
      ]
    },
    {
      title: 'Orders',
      items: [
        { label: 'Live Orders', path: '/admin-orders', icon: 'Clock' },
        { label: 'Order History', path: '/admin-order-history', icon: 'History' },
        { label: 'Kitchen Display', path: '/kitchen-display-system', icon: 'Monitor' },
      ]
    },
    {
      title: 'Menu Management',
      items: [
        { label: 'Menu Items', path: '/admin-menu', icon: 'ChefHat' },
        { label: 'Categories', path: '/admin-categories', icon: 'Grid3X3' },
        { label: 'Pricing', path: '/admin-pricing', icon: 'DollarSign' },
      ]
    },
    {
      title: 'Customers',
      items: [
        { label: 'Customer List', path: '/admin-customers', icon: 'Users' },
        { label: 'Reviews', path: '/admin-reviews', icon: 'Star' },
        { label: 'Loyalty', path: '/admin-loyalty', icon: 'Gift' },
      ]
    },
    {
      title: 'Settings',
      items: [
        { label: 'Restaurant', path: '/admin-restaurant-settings', icon: 'Store' },
        { label: 'Staff', path: '/admin-staff', icon: 'UserCheck' },
        { label: 'System', path: '/admin-system-settings', icon: 'Settings' },
      ]
    }
  ];

  const isActivePath = (path) => location.pathname === path;

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-navigation bg-surface shadow-soft border-b border-border">
        <div className="px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Mobile Menu Button */}
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 text-text-secondary hover:text-primary transition-smooth"
              >
                <Icon name="Menu" size={24} />
              </button>
              
              <Link to="/restaurant-admin-dashboard" className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="ChefHat" size={20} color="white" />
                </div>
                <div className="hidden sm:block">
                  <span className="text-xl font-heading font-heading-medium text-text-primary">
                    TasteBite
                  </span>
                  <span className="text-sm text-text-secondary font-body block">
                    Admin Dashboard
                  </span>
                </div>
              </Link>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-text-secondary hover:text-primary transition-smooth">
                <Icon name="Bell" size={20} />
                <span className="absolute -top-1 -right-1 bg-error text-white text-xs font-body font-body-medium rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </button>

              {/* User Menu */}
              <div className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-secondary-50 transition-smooth cursor-pointer">
                <div className="w-8 h-8 bg-secondary-200 rounded-full flex items-center justify-center">
                  <Icon name="User" size={16} className="text-secondary" />
                </div>
                <span className="hidden sm:block text-sm font-body font-body-medium text-text-primary">
                  Admin User
                </span>
                <Icon name="ChevronDown" size={16} className="text-text-secondary" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className={`hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-dropdown lg:block lg:bg-surface lg:border-r lg:border-border lg:shadow-soft transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:w-16' : 'lg:w-64'
      }`}>
        <div className="flex flex-col h-full pt-16">
          {/* Sidebar Toggle */}
          <div className="px-4 py-4 border-b border-border">
            <button
              onClick={toggleSidebar}
              className="w-full flex items-center justify-center p-2 text-text-secondary hover:text-primary hover:bg-primary-50 rounded-lg transition-smooth"
            >
              <Icon name={isSidebarCollapsed ? "ChevronRight" : "ChevronLeft"} size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
            {navigationSections.map((section) => (
              <div key={section.title}>
                {!isSidebarCollapsed && (
                  <h3 className="text-xs font-body font-body-medium text-text-secondary uppercase tracking-wider mb-3">
                    {section.title}
                  </h3>
                )}
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center px-3 py-2 rounded-lg transition-smooth font-body font-body-medium ${
                        isActivePath(item.path)
                          ? 'text-primary bg-primary-50 border-r-2 border-primary' :'text-text-secondary hover:text-primary hover:bg-primary-50'
                      } ${isSidebarCollapsed ? 'justify-center' : 'space-x-3'}`}
                      title={isSidebarCollapsed ? item.label : ''}
                    >
                      <Icon name={item.icon} size={20} />
                      {!isSidebarCollapsed && <span>{item.label}</span>}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-modal">
          <div className="fixed inset-0 bg-secondary-900 bg-opacity-50" onClick={toggleMobileMenu}></div>
          <div className="fixed inset-y-0 left-0 w-64 bg-surface shadow-floating">
            <div className="flex flex-col h-full pt-16">
              <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
                {navigationSections.map((section) => (
                  <div key={section.title}>
                    <h3 className="text-xs font-body font-body-medium text-text-secondary uppercase tracking-wider mb-3">
                      {section.title}
                    </h3>
                    <div className="space-y-1">
                      {section.items.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={toggleMobileMenu}
                          className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-smooth font-body font-body-medium min-h-touch ${
                            isActivePath(item.path)
                              ? 'text-primary bg-primary-50' :'text-text-secondary hover:text-primary hover:bg-primary-50'
                          }`}
                        >
                          <Icon name={item.icon} size={20} />
                          <span>{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminNavigation;