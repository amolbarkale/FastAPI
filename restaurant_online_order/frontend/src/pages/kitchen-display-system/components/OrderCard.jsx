// src/pages/kitchen-display-system/components/OrderCard.jsx
import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';

function OrderCard({
  order,
  onStatusUpdate,
  onPriorityUpdate,
  onItemToggle,
  currentTime,
  className = ''
}) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);

  useEffect(() => {
    if (order?.timestamp) {
      const elapsed = Math.floor((currentTime - new Date(order.timestamp)) / 1000 / 60);
      setElapsedTime(elapsed);
    }
  }, [currentTime, order?.timestamp]);

  const formatElapsedTime = (minutes) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-error text-white';
      case 'high':
        return 'bg-warning text-white';
      case 'normal':
        return 'bg-secondary-100 text-secondary';
      default:
        return 'bg-secondary-100 text-secondary';
    }
  };

  const getDeliveryMethodIcon = (method) => {
    switch (method) {
      case 'dine-in':
        return 'Utensils';
      case 'pickup':
        return 'Package';
      case 'delivery':
        return 'Truck';
      default:
        return 'ShoppingBag';
    }
  };

  const getStatusActions = (currentStatus) => {
    switch (currentStatus) {
      case 'new':
        return [{ label: 'Start Cooking', status: 'in-progress', icon: 'Play' }];
      case 'in-progress':
        return [{ label: 'Mark Ready', status: 'ready', icon: 'CheckCircle' }];
      case 'ready':
        return [{ label: 'Complete', status: 'completed', icon: 'Check' }];
      case 'completed':
        return [];
      default:
        return [];
    }
  };

  const getUrgencyStatus = () => {
    if (order?.priority === 'urgent') return 'urgent';
    if (order?.priority === 'high') return 'high';
    if (elapsedTime >= (order?.estimatedTime || 20)) return 'overdue';
    if (elapsedTime >= (order?.estimatedTime || 20) * 0.8) return 'warning';
    return 'normal';
  };

  const urgencyStatus = getUrgencyStatus();
  const completedItems = order?.items?.filter(item => item?.completed)?.length || 0;
  const totalItems = order?.items?.length || 0;
  const completionPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  return (
    <div
      className={`bg-surface rounded-xl shadow-soft border transition-smooth hover:shadow-floating ${
        urgencyStatus === 'urgent' ? 'border-error shadow-error/20' :
        urgencyStatus === 'overdue' ? 'border-warning shadow-warning/20' :
        urgencyStatus === 'high' ? 'border-accent shadow-accent/20' :
        'border-border'
      } ${className}`}
    >
      {/* Card Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-heading font-heading-medium text-text-primary">
                #{order?.number}
              </h3>
              <div className={`px-2 py-1 rounded-full text-xs font-body font-body-medium ${getPriorityColor(order?.priority)}`}>
                {order?.priority?.toUpperCase()}
              </div>
              {urgencyStatus === 'overdue' && (
                <div className="px-2 py-1 bg-error text-white rounded-full text-xs font-body font-body-medium animate-pulse">
                  OVERDUE
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-text-secondary">
              <div className="flex items-center space-x-1">
                <Icon name="User" size={14} />
                <span className="font-body">{order?.customerName}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Icon name={getDeliveryMethodIcon(order?.deliveryMethod)} size={14} />
                <span className="font-body capitalize">{order?.deliveryMethod}</span>
              </div>
              
              {order?.tableNumber && (
                <div className="flex items-center space-x-1">
                  <Icon name="MapPin" size={14} />
                  <span className="font-body">Table {order.tableNumber}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="text-right">
            <div className={`text-sm font-data font-data-normal ${
              elapsedTime >= (order?.estimatedTime || 20) ? 'text-error' :
              elapsedTime >= (order?.estimatedTime || 20) * 0.8 ? 'text-warning': 'text-text-secondary'
            }`}>
              {formatElapsedTime(elapsedTime)}
            </div>
            <div className="text-xs text-text-secondary font-body mt-1">
              Est: {order?.estimatedTime}m
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-text-secondary mb-1">
            <span className="font-body">Progress</span>
            <span className="font-body">{completedItems}/{totalItems} items</span>
          </div>
          <div className="w-full bg-secondary-100 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-smooth ${
                completionPercentage === 100 ? 'bg-success' :
                completionPercentage > 50 ? 'bg-primary': 'bg-accent'
              }`}
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="p-4">
        <div className="space-y-2">
          {order?.items?.slice(0, isExpanded ? undefined : 3)?.map((item) => (
            <div
              key={item?.id}
              className={`flex items-center justify-between p-2 rounded-lg transition-smooth ${
                item?.completed ? 'bg-success-50' : 'bg-secondary-50'
              }`}
            >
              <div className="flex items-center space-x-3 flex-1">
                <button
                  onClick={() => onItemToggle?.(order?.id, item?.id)}
                  className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-smooth ${
                    item?.completed
                      ? 'bg-success border-success text-white' :'border-secondary-300 hover:border-primary'
                  }`}
                >
                  {item?.completed && <Icon name="Check" size={12} />}
                </button>
                
                <div className="flex-1">
                  <div className={`text-sm font-body font-body-medium ${
                    item?.completed ? 'text-success line-through' : 'text-text-primary'
                  }`}>
                    {item?.quantity}x {item?.name}
                  </div>
                  {item?.specialInstructions && (
                    <div className="text-xs text-text-secondary font-body mt-1">
                      {item.specialInstructions}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {order?.items?.length > 3 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full text-sm text-primary hover:text-primary-700 font-body font-body-medium py-2 transition-smooth"
            >
              {isExpanded ? 'Show Less' : `Show ${order.items.length - 3} More Items`}
            </button>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* Priority Button */}
            <div className="relative">
              <button
                onClick={() => setShowPriorityMenu(!showPriorityMenu)}
                className="p-2 text-text-secondary hover:text-primary hover:bg-primary-50 rounded-lg transition-smooth min-w-touch min-h-touch"
              >
                <Icon name="Flag" size={16} />
              </button>
              
              {showPriorityMenu && (
                <div className="absolute bottom-full left-0 mb-2 bg-surface border border-border rounded-lg shadow-floating z-dropdown min-w-32">
                  {['normal', 'high', 'urgent'].map((priority) => (
                    <button
                      key={priority}
                      onClick={() => {
                        onPriorityUpdate?.(order?.id, priority);
                        setShowPriorityMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm font-body hover:bg-primary-50 first:rounded-t-lg last:rounded-b-lg transition-smooth ${
                        order?.priority === priority ? 'bg-primary-50 text-primary' : 'text-text-secondary'
                      }`}
                    >
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Print Button */}
            <button className="p-2 text-text-secondary hover:text-primary hover:bg-primary-50 rounded-lg transition-smooth min-w-touch min-h-touch">
              <Icon name="Printer" size={16} />
            </button>
          </div>
          
          {/* Status Action Buttons */}
          <div className="flex items-center space-x-2">
            {getStatusActions(order?.status)?.map((action, index) => (
              <button
                key={index}
                onClick={() => onStatusUpdate?.(order?.id, action.status)}
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-smooth font-body font-body-medium"
              >
                <Icon name={action.icon} size={16} />
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderCard;