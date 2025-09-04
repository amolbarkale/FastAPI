import React from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';

function TopSellingItems({ items }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-heading font-heading-medium text-text-primary">
          Top Selling Items
        </h2>
        <Link 
          to="/admin-menu" 
          className="text-sm text-primary hover:text-primary-700 font-body font-body-medium flex items-center"
        >
          <span>View All</span>
          <Icon name="ChevronRight" size={16} className="ml-1" />
        </Link>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div 
            key={item.id} 
            className="flex items-center p-3 rounded-lg hover:bg-secondary-50 transition-smooth"
          >
            <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center mr-3">
              <Icon 
                name={getCategoryIcon(item.category)} 
                size={20} 
                className="text-primary"
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-body font-body-medium text-text-primary truncate">
                    {item.name}
                  </h3>
                  <p className="text-xs text-text-secondary font-body">
                    {item.category}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-body font-body-medium text-text-primary">
                    ${item.revenue.toLocaleString()}
                  </p>
                  <div className="flex items-center text-xs">
                    <Icon 
                      name={item.growth >= 0 ? "TrendingUp" : "TrendingDown"} 
                      size={12} 
                      className={item.growth >= 0 ? "text-success" : "text-error"} 
                    />
                    <span className={`ml-1 ${item.growth >= 0 ? "text-success" : "text-error"}`}>
                      {Math.abs(item.growth)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Icon name="Package" size={32} className="text-text-secondary mb-2" />
          <p className="text-text-secondary font-body">No items to display</p>
        </div>
      )}
    </div>
  );
}

// Helper function to get icon based on food category
function getCategoryIcon(category) {
  const iconMap = {
    'Pizza': 'Pizza',
    'Pasta': 'Utensils',
    'Burgers': 'Sandwich',
    'Salads': 'Salad',
    'Desserts': 'Cake',
    'Drinks': 'Coffee',
    'Appetizers': 'UtensilsCrossed',
    'Seafood': 'Fish',
    'Chicken': 'Drumstick',
    'Vegetarian': 'Leaf'
  };
  
  return iconMap[category] || 'Utensils';
}

export default TopSellingItems;