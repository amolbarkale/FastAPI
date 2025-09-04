// src/pages/kitchen-display-system/components/StationFilter.jsx
import React from 'react';
import Icon from 'components/AppIcon';

function StationFilter({ selectedStation, onStationChange, orderCounts, className = '' }) {
  const stations = [
    { id: 'all', name: 'All Stations', icon: 'Grid3X3', count: orderCounts?.all || 0 },
    { id: 'grill', name: 'Grill', icon: 'Flame', count: orderCounts?.grill || 0 },
    { id: 'fryer', name: 'Fryer', icon: 'ChefHat', count: orderCounts?.fryer || 0 },
    { id: 'salad', name: 'Salad', icon: 'Salad', count: orderCounts?.salad || 0 },
    { id: 'beverages', name: 'Beverages', icon: 'Coffee', count: orderCounts?.beverages || 0 }
  ];

  return (
    <div className={`mb-6 ${className}`}>
      <div className="bg-surface rounded-xl shadow-soft border border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-heading font-heading-medium text-text-primary">
            Kitchen Stations
          </h2>
          <div className="text-sm text-text-secondary font-body">
            Filter by preparation area
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {stations?.map((station) => (
            <button
              key={station?.id}
              onClick={() => onStationChange?.(station?.id)}
              className={`relative flex flex-col items-center p-4 rounded-lg border transition-smooth hover:shadow-soft ${
                selectedStation === station?.id
                  ? 'bg-primary text-white border-primary shadow-soft'
                  : 'bg-surface text-text-secondary border-border hover:border-primary hover:text-primary'
              }`}
            >
              <Icon 
                name={station?.icon} 
                size={24} 
                className={`mb-2 ${
                  selectedStation === station?.id ? 'text-white' : 'text-current'
                }`}
              />
              
              <span className={`text-sm font-body font-body-medium mb-1 ${
                selectedStation === station?.id ? 'text-white' : 'text-text-primary'
              }`}>
                {station?.name}
              </span>
              
              <div className={`text-xs font-data font-data-normal ${
                selectedStation === station?.id ? 'text-white' : 'text-text-secondary'
              }`}>
                {station?.count} orders
              </div>
              
              {/* Active indicator */}
              {selectedStation === station?.id && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full" />
              )}
              
              {/* Order count badge */}
              {station?.count > 0 && selectedStation !== station?.id && (
                <div className="absolute -top-2 -right-2 bg-primary text-white text-xs font-data font-data-normal min-w-6 h-6 rounded-full flex items-center justify-center">
                  {station?.count > 99 ? '99+' : station?.count}
                </div>
              )}
            </button>
          ))}
        </div>
        
        {/* Quick Stats */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-lg font-data font-data-normal text-text-primary">
                {orderCounts?.all || 0}
              </div>
              <div className="text-xs text-text-secondary font-body">
                Total Orders
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-data font-data-normal text-warning">
                {Math.floor((orderCounts?.all || 0) * 0.3)}
              </div>
              <div className="text-xs text-text-secondary font-body">
                In Progress
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-data font-data-normal text-primary">
                {Math.floor((orderCounts?.all || 0) * 0.2)}
              </div>
              <div className="text-xs text-text-secondary font-body">
                Ready
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-data font-data-normal text-success">
                {Math.floor((orderCounts?.all || 0) * 0.5)}
              </div>
              <div className="text-xs text-text-secondary font-body">
                Completed
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StationFilter;