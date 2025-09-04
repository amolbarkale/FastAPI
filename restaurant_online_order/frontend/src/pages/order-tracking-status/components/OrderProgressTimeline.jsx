import React from 'react';
import Icon from 'components/AppIcon';

function OrderProgressTimeline({ timeline, currentStatus }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return 'CheckCircle';
      case 'preparing':
        return 'ChefHat';
      case 'ready':
        return 'Package';
      case 'out_for_delivery':
        return 'Truck';
      case 'delivered':
        return 'MapPin';
      default:
        return 'Circle';
    }
  };

  const getStatusColor = (status, isActive, isCompleted) => {
    if (isCompleted) return 'text-success bg-success-50 border-success';
    if (isActive) return 'text-primary bg-primary-50 border-primary';
    return 'text-text-secondary bg-secondary-50 border-border';
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return null;
    return timestamp.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatEstimatedTime = (estimatedTime) => {
    if (!estimatedTime) return null;
    const now = new Date();
    const diff = estimatedTime.getTime() - now.getTime();
    const minutes = Math.max(0, Math.ceil(diff / (1000 * 60)));
    
    if (minutes === 0) return 'Any moment now';
    if (minutes === 1) return 'In 1 minute';
    return `In ${minutes} minutes`;
  };

  const getCurrentStepIndex = () => {
    return timeline.findIndex(step => step.status === currentStatus);
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="bg-surface rounded-xl border border-border p-6">
      <h2 className="text-xl font-heading font-heading-medium text-text-primary mb-6">
        Order Progress
      </h2>
      
      <div className="space-y-6">
        {timeline.map((step, index) => {
          const isCompleted = index < currentStepIndex || (index === currentStepIndex && step.timestamp);
          const isActive = index === currentStepIndex && !step.timestamp;
          const isFuture = index > currentStepIndex;

          return (
            <div key={step.status} className="relative">
              {/* Timeline Line */}
              {index < timeline.length - 1 && (
                <div className={`absolute left-6 top-12 w-0.5 h-16 ${
                  isCompleted ? 'bg-success' : 'bg-border'
                }`}></div>
              )}

              <div className="flex items-start space-x-4">
                {/* Status Icon */}
                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-smooth ${
                  getStatusColor(step.status, isActive, isCompleted)
                }`}>
                  <Icon 
                    name={getStatusIcon(step.status)} 
                    size={20}
                    className={isCompleted ? 'text-success' : isActive ? 'text-primary' : 'text-text-secondary'}
                  />
                </div>

                {/* Status Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`font-heading font-heading-medium ${
                      isCompleted || isActive ? 'text-text-primary' : 'text-text-secondary'
                    }`}>
                      {step.title}
                    </h3>
                    
                    {/* Timestamp or Estimated Time */}
                    <div className="text-sm font-body">
                      {step.timestamp ? (
                        <span className="text-success font-body-medium">
                          {formatTime(step.timestamp)}
                        </span>
                      ) : isActive && step.estimatedCompletion ? (
                        <span className="text-primary font-body-medium">
                          {formatEstimatedTime(step.estimatedCompletion)}
                        </span>
                      ) : isFuture && step.estimatedCompletion ? (
                        <span className="text-text-secondary">
                          Est. {formatTime(step.estimatedCompletion)}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  
                  <p className={`text-sm font-body ${
                    isCompleted || isActive ? 'text-text-secondary' : 'text-text-secondary opacity-60'
                  }`}>
                    {step.description}
                  </p>

                  {/* Active Status Indicator */}
                  {isActive && (
                    <div className="mt-3 flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                      <span className="text-sm text-primary font-body font-body-medium">
                        In Progress
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Estimated Delivery Time */}
      {currentStatus !== 'delivered' && (
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary font-body">
                Estimated Delivery Time
              </p>
              <p className="text-lg font-heading font-heading-medium text-text-primary">
                {timeline.find(step => step.status === 'delivered')?.estimatedCompletion?.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                }) || 'Calculating...'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-text-secondary font-body">
                Time Remaining
              </p>
              <p className="text-lg font-heading font-heading-medium text-primary">
                {formatEstimatedTime(timeline.find(step => step.status === 'delivered')?.estimatedCompletion) || 'Calculating...'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderProgressTimeline;