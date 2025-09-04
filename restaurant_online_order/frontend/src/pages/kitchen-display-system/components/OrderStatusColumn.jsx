// src/pages/kitchen-display-system/components/OrderStatusColumn.jsx
import React from 'react';
import Icon from 'components/AppIcon';
import OrderCard from './OrderCard';

function OrderStatusColumn({
  title,
  status,
  orders,
  onOrderStatusUpdate,
  onOrderPriorityUpdate,
  onItemToggle,
  currentTime,
  color = 'primary',
  className = ''
}) {
  const getColorClasses = (colorName) => {
    const colorMap = {
      primary: {
        header: 'bg-primary-50 text-primary border-primary-200',
        icon: 'text-primary',
        count: 'bg-primary text-white'
      },
      secondary: {
        header: 'bg-secondary-50 text-secondary border-secondary-200',
        icon: 'text-secondary',
        count: 'bg-secondary text-white'
      },
      accent: {
        header: 'bg-accent-50 text-accent border-accent-200',
        icon: 'text-accent',
        count: 'bg-accent text-white'
      },
      success: {
        header: 'bg-success-50 text-success border-success-200',
        icon: 'text-success',
        count: 'bg-success text-white'
      },
      warning: {
        header: 'bg-warning-50 text-warning border-warning-200',
        icon: 'text-warning',
        count: 'bg-warning text-white'
      },
      error: {
        header: 'bg-error-50 text-error border-error-200',
        icon: 'text-error',
        count: 'bg-error text-white'
      }
    };
    return colorMap[colorName] || colorMap.primary;
  };

  const getStatusIcon = (statusType) => {
    switch (statusType) {
      case 'new':
        return 'Clock';
      case 'in-progress':
        return 'Timer';
      case 'ready':
        return 'CheckCircle';
      case 'completed':
        return 'Check';
      default:
        return 'Circle';
    }
  };

  const colors = getColorClasses(color);
  const orderCount = orders?.length || 0;
  
  // Calculate urgency counts
  const urgentOrders = orders?.filter(order => {
    const elapsed = Math.floor((currentTime - new Date(order?.timestamp)) / 1000 / 60);
    return order?.priority === 'urgent' || elapsed >= (order?.estimatedTime || 20);
  })?.length || 0;

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Column Header */}
      <div className={`p-4 rounded-t-xl border-2 ${colors.header}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon name={getStatusIcon(status)} size={20} className={colors.icon} />
            <h3 className="font-heading font-heading-medium text-lg">
              {title}
            </h3>
          </div>
          
          <div className="flex items-center space-x-2">
            {urgentOrders > 0 && (
              <div className="bg-error text-white text-xs font-data font-data-normal px-2 py-1 rounded-full animate-pulse">
                {urgentOrders} urgent
              </div>
            )}
            
            <div className={`text-sm font-data font-data-normal px-3 py-1 rounded-full ${colors.count}`}>
              {orderCount}
            </div>
          </div>
        </div>
        
        {/* Average time indicator */}
        {orderCount > 0 && (
          <div className="mt-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="font-body">Avg Time:</span>
              <span className="font-data font-data-normal">
                {Math.floor(orders?.reduce((acc, order) => {
                  const elapsed = Math.floor((currentTime - new Date(order?.timestamp)) / 1000 / 60);
                  return acc + elapsed;
                }, 0) / orderCount)}m
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Orders List */}
      <div className="flex-1 bg-background border-l-2 border-r-2 border-b-2 border-border rounded-b-xl overflow-hidden">
        {orderCount === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-text-secondary">
            <Icon name="FileX" size={48} className="mb-4 opacity-50" />
            <p className="font-body text-center">
              No {status.replace('-', ' ')} orders
            </p>
            <p className="font-body text-sm text-center mt-1 opacity-75">
              Orders will appear here when available
            </p>
          </div>
        ) : (
          <div className="p-3 space-y-3 max-h-screen overflow-y-auto">
            {orders?.map((order) => (
              <OrderCard
                key={order?.id}
                order={order}
                onStatusUpdate={onOrderStatusUpdate}
                onPriorityUpdate={onOrderPriorityUpdate}
                onItemToggle={onItemToggle}
                currentTime={currentTime}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Column Footer Stats */}
      {orderCount > 0 && (
        <div className="mt-2 p-3 bg-surface rounded-lg border border-border">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-sm font-data font-data-normal text-text-primary">
                {orders?.filter(order => order?.priority === 'high' || order?.priority === 'urgent')?.length || 0}
              </div>
              <div className="text-xs text-text-secondary font-body">
                Priority
              </div>
            </div>
            
            <div>
              <div className="text-sm font-data font-data-normal text-text-primary">
                {orders?.reduce((acc, order) => acc + (order?.items?.length || 0), 0)}
              </div>
              <div className="text-xs text-text-secondary font-body">
                Items
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderStatusColumn;