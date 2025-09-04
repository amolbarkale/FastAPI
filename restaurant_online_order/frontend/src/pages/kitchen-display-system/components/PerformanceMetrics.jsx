// src/pages/kitchen-display-system/components/PerformanceMetrics.jsx
import React from 'react';
import Icon from 'components/AppIcon';

function PerformanceMetrics({ metrics, className = '' }) {
  const metricCards = [
    {
      title: 'Average Prep Time',
      value: `${metrics?.averagePrepTime?.toFixed(1) || '0.0'}m`,
      icon: 'Timer',
      color: 'primary',
      trend: -0.8,
      target: '12.0m'
    },
    {
      title: 'Completion Rate',
      value: `${metrics?.completionRate?.toFixed(1) || '0.0'}%`,
      icon: 'CheckCircle',
      color: 'success',
      trend: +2.3,
      target: '95.0%'
    },
    {
      title: 'Active Orders',
      value: metrics?.activeOrders || 0,
      icon: 'Clock',
      color: 'warning',
      trend: null,
      target: null
    },
    {
      title: 'Total Orders',
      value: metrics?.totalOrders || 0,
      icon: 'ShoppingBag',
      color: 'secondary',
      trend: +12.5,
      target: null
    }
  ];

  const getColorClasses = (colorName) => {
    const colorMap = {
      primary: 'bg-primary-50 text-primary',
      secondary: 'bg-secondary-50 text-secondary',
      success: 'bg-success-50 text-success',
      warning: 'bg-warning-50 text-warning',
      error: 'bg-error-50 text-error'
    };
    return colorMap[colorName] || colorMap.primary;
  };

  const getTrendIcon = (trend) => {
    if (trend === null || trend === undefined) return null;
    return trend >= 0 ? 'TrendingUp' : 'TrendingDown';
  };

  const getTrendColor = (trend) => {
    if (trend === null || trend === undefined) return '';
    return trend >= 0 ? 'text-success' : 'text-error';
  };

  return (
    <div className={`bg-surface rounded-xl shadow-soft border border-border p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading font-heading-medium text-text-primary">
            Performance Metrics
          </h2>
          <p className="text-text-secondary font-body text-sm mt-1">
            Real-time kitchen performance overview
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
          <span className="text-sm text-text-secondary font-body">
            Live Data
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards?.map((metric, index) => (
          <div key={index} className="bg-background rounded-lg p-4 border border-border">
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-lg ${getColorClasses(metric?.color)}`}>
                <Icon name={metric?.icon} size={20} />
              </div>
              
              {metric?.trend !== null && metric?.trend !== undefined && (
                <div className={`flex items-center space-x-1 ${getTrendColor(metric?.trend)}`}>
                  <Icon name={getTrendIcon(metric?.trend)} size={14} />
                  <span className="text-xs font-body font-body-medium">
                    {Math.abs(metric?.trend)}%
                  </span>
                </div>
              )}
            </div>
            
            <div>
              <div className="text-2xl font-heading font-heading-bold text-text-primary mb-1">
                {metric?.value}
              </div>
              
              <div className="text-sm text-text-secondary font-body mb-2">
                {metric?.title}
              </div>
              
              {metric?.target && (
                <div className="text-xs text-text-secondary font-body">
                  Target: {metric?.target}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Additional Metrics */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Station Performance */}
          <div>
            <h3 className="text-sm font-heading font-heading-medium text-text-primary mb-3">
              Station Performance
            </h3>
            <div className="space-y-2">
              {[
                { name: 'Grill', efficiency: 94, color: 'bg-success' },
                { name: 'Fryer', efficiency: 87, color: 'bg-warning' },
                { name: 'Salad', efficiency: 98, color: 'bg-success' },
                { name: 'Beverages', efficiency: 91, color: 'bg-primary' }
              ].map((station, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-body text-text-secondary">
                    {station?.name}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-secondary-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${station?.color}`}
                        style={{ width: `${station?.efficiency}%` }}
                      />
                    </div>
                    <span className="text-xs font-data font-data-normal text-text-primary min-w-8">
                      {station?.efficiency}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Volume by Hour */}
          <div>
            <h3 className="text-sm font-heading font-heading-medium text-text-primary mb-3">
              Today's Order Volume
            </h3>
            <div className="space-y-2">
              {[
                { hour: '11-12', orders: 23 },
                { hour: '12-13', orders: 45 },
                { hour: '13-14', orders: 38 },
                { hour: '18-19', orders: 52 }
              ].map((hour, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-body text-text-secondary">
                    {hour?.hour}
                  </span>
                  <span className="text-sm font-data font-data-normal text-text-primary">
                    {hour?.orders} orders
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quality Metrics */}
          <div>
            <h3 className="text-sm font-heading font-heading-medium text-text-primary mb-3">
              Quality Metrics
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-body text-text-secondary">
                  Order Accuracy
                </span>
                <span className="text-sm font-data font-data-normal text-success">
                  96.8%
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-body text-text-secondary">
                  Customer Rating
                </span>
                <div className="flex items-center space-x-1">
                  <Icon name="Star" size={14} className="text-warning" />
                  <span className="text-sm font-data font-data-normal text-text-primary">
                    4.7
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-body text-text-secondary">
                  Returns/Remakes
                </span>
                <span className="text-sm font-data font-data-normal text-text-primary">
                  2.1%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PerformanceMetrics;