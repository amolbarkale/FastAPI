import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

function KitchenInterface() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [connectionStatus, setConnectionStatus] = useState('connected'); // connected, disconnected, reconnecting
  const [pendingOrders] = useState(12); // This would come from WebSocket in real app

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'text-success';
      case 'disconnected':
        return 'text-error';
      case 'reconnecting':
        return 'text-warning';
      default:
        return 'text-text-secondary';
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Wifi';
      case 'disconnected':
        return 'WifiOff';
      case 'reconnecting':
        return 'RotateCw';
      default:
        return 'Wifi';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-navigation bg-surface shadow-soft border-b border-border">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Restaurant Name */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="ChefHat" size={24} color="white" />
            </div>
            <div>
              <h1 className="text-lg font-heading font-heading-medium text-text-primary">
                TasteBite Kitchen
              </h1>
              <p className="text-sm text-text-secondary font-body">
                Kitchen Display System
              </p>
            </div>
          </div>

          {/* System Status and Info */}
          <div className="flex items-center space-x-8">
            {/* Pending Orders Count */}
            <div className="flex items-center space-x-2 px-4 py-2 bg-accent-50 rounded-lg">
              <Icon name="Clock" size={20} className="text-accent" />
              <span className="font-data font-data-normal text-lg text-text-primary">
                {pendingOrders}
              </span>
              <span className="text-sm text-text-secondary font-body">
                pending
              </span>
            </div>

            {/* Connection Status */}
            <div className="flex items-center space-x-2">
              <Icon 
                name={getStatusIcon()} 
                size={20} 
                className={`${getStatusColor()} ${connectionStatus === 'reconnecting' ? 'animate-spin' : ''}`}
              />
              <span className={`text-sm font-body font-body-medium capitalize ${getStatusColor()}`}>
                {connectionStatus}
              </span>
            </div>

            {/* Current Time */}
            <div className="flex items-center space-x-2 px-4 py-2 bg-secondary-50 rounded-lg">
              <Icon name="Clock" size={18} className="text-secondary" />
              <span className="font-data font-data-normal text-lg text-text-primary">
                {formatTime(currentTime)}
              </span>
            </div>

            {/* Settings/Options */}
            <button className="p-2 text-text-secondary hover:text-primary hover:bg-primary-50 rounded-lg transition-smooth min-w-touch min-h-touch">
              <Icon name="Settings" size={24} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default KitchenInterface;