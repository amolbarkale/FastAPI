// src/pages/kitchen-display-system/components/OrderModificationAlert.jsx
import React from 'react';
import Icon from 'components/AppIcon';

function OrderModificationAlert({ orders, onDismiss, className = '' }) {
  if (!orders || orders?.length === 0) {
    return null;
  }

  return (
    <div className={`bg-warning-50 border border-warning-200 rounded-xl p-4 ${className}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <Icon name="AlertTriangle" size={24} className="text-warning" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-heading font-heading-medium text-warning">
              Order Modifications
            </h3>
            <span className="text-sm text-warning font-body">
              {orders?.length} modified order{orders?.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          <p className="text-sm text-warning-600 font-body mb-4">
            The following orders have been modified by customers. Please review changes and update preparation accordingly.
          </p>
          
          <div className="space-y-3">
            {orders?.map((order) => (
              <div key={order?.id} className="bg-surface rounded-lg p-4 border border-warning-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-base font-heading font-heading-medium text-text-primary">
                        Order #{order?.number}
                      </h4>
                      <span className="text-sm text-text-secondary font-body">
                        {order?.customerName}
                      </span>
                      <span className="px-2 py-1 bg-warning text-white text-xs font-body font-body-medium rounded-full">
                        MODIFIED
                      </span>
                    </div>
                    
                    {/* Modification Details */}
                    <div className="space-y-2">
                      {order?.modifications?.map((mod, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <Icon 
                            name={mod?.type === 'added' ? 'Plus' : mod?.type === 'removed' ? 'Minus' : 'Edit'} 
                            size={16} 
                            className={`mt-0.5 ${
                              mod?.type === 'added' ? 'text-success' :
                              mod?.type === 'removed'? 'text-error' : 'text-warning'
                            }`}
                          />
                          <div className="flex-1">
                            <div className="text-sm font-body text-text-primary">
                              <span className="font-body-medium capitalize">{mod?.type}:</span> {mod?.description}
                            </div>
                            {mod?.specialInstructions && (
                              <div className="text-xs text-text-secondary font-body mt-1">
                                Special instructions: {mod?.specialInstructions}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Modification Time */}
                    <div className="mt-3 text-xs text-text-secondary font-body">
                      Modified: {order?.modificationTime ? new Date(order?.modificationTime).toLocaleTimeString() : 'Just now'}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => onDismiss?.(order?.id)}
                      className="p-2 text-text-secondary hover:text-success hover:bg-success-50 rounded-lg transition-smooth min-w-touch min-h-touch"
                      title="Mark as reviewed"
                    >
                      <Icon name="Check" size={16} />
                    </button>
                    
                    <button className="p-2 text-text-secondary hover:text-primary hover:bg-primary-50 rounded-lg transition-smooth min-w-touch min-h-touch">
                      <Icon name="Printer" size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Actions */}
          <div className="mt-4 flex items-center justify-between pt-4 border-t border-warning-200">
            <button
              onClick={() => {
                orders?.forEach(order => onDismiss?.(order?.id));
              }}
              className="text-sm text-warning hover:text-warning-700 font-body font-body-medium transition-smooth"
            >
              Mark all as reviewed
            </button>
            
            <div className="flex items-center space-x-2">
              <button className="flex items-center space-x-2 px-3 py-2 bg-warning text-white rounded-lg hover:bg-warning-600 transition-smooth font-body font-body-medium">
                <Icon name="Printer" size={16} />
                <span>Print All</span>
              </button>
              
              <button className="flex items-center space-x-2 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-smooth font-body font-body-medium">
                <Icon name="MessageSquare" size={16} />
                <span>Contact Customer</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderModificationAlert;