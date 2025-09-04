import React from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';

function RecentActivity({ activities }) {
  // Function to format the timestamp to a relative time string
  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - timestamp) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  // Function to get icon based on activity type
  const getActivityIcon = (type) => {
    const iconMap = {
      order: 'ShoppingBag',
      inventory: 'Package',
      review: 'Star',
      system: 'Settings',
      payment: 'CreditCard',
      staff: 'Users',
      customer: 'User'
    };
    return iconMap[type] || 'Bell';
  };

  // Function to get status color based on activity status
  const getStatusColor = (status) => {
    const colorMap = {
      new: 'bg-primary-50 text-primary',
      success: 'bg-success-50 text-success',
      warning: 'bg-warning-50 text-warning',
      error: 'bg-error-50 text-error',
      info: 'bg-secondary-50 text-secondary',
      positive: 'bg-success-50 text-success'
    };
    return colorMap[status] || 'bg-secondary-50 text-secondary';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-heading font-heading-medium text-text-primary">
          Recent Activity
        </h2>
        <Link 
          to="/admin-activity-log" 
          className="text-sm text-primary hover:text-primary-700 font-body font-body-medium flex items-center"
        >
          <span>View All</span>
          <Icon name="ChevronRight" size={16} className="ml-1" />
        </Link>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div 
            key={activity.id} 
            className="flex items-start p-3 rounded-lg hover:bg-secondary-50 transition-smooth"
          >
            <div className={`p-2 rounded-lg mr-3 ${getStatusColor(activity.status)}`}>
              <Icon name={getActivityIcon(activity.type)} size={18} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <h3 className="text-sm font-body font-body-medium text-text-primary truncate">
                  {activity.title}
                </h3>
                <span className="text-xs text-text-secondary font-body ml-2 whitespace-nowrap">
                  {getRelativeTime(activity.timestamp)}
                </span>
              </div>
              <p className="text-xs text-text-secondary font-body mt-1">
                {activity.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {activities.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Icon name="Calendar" size={32} className="text-text-secondary mb-2" />
          <p className="text-text-secondary font-body">No recent activity to display</p>
        </div>
      )}
    </div>
  );
}

export default RecentActivity;