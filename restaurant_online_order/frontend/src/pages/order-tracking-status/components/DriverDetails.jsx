import React from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

function DriverDetails({ driver }) {
  const handleCallDriver = () => {
    window.location.href = `tel:${driver.phone}`;
  };

  const handleMessageDriver = () => {
    console.log("Opening message interface with driver");
  };

  return (
    <div className="bg-surface rounded-xl border border-border p-6">
      <h3 className="text-lg font-heading font-heading-medium text-text-primary mb-4">
        Your Delivery Driver
      </h3>

      <div className="flex items-start space-x-4">
        {/* Driver Photo */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-border">
            <Image
              src={driver.photo}
              alt={driver.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Driver Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="font-heading font-heading-medium text-text-primary">
                {driver.name}
              </h4>
              <div className="flex items-center space-x-2 mt-1">
                <div className="flex items-center space-x-1">
                  <Icon name="Star" size={16} className="text-warning fill-current" />
                  <span className="text-sm font-body font-body-medium text-text-primary">
                    {driver.rating}
                  </span>
                </div>
                <span className="text-sm text-text-secondary font-body">
                  • {driver.vehicle}
                </span>
              </div>
            </div>
            
            {/* Status Badge */}
            <div className="flex items-center space-x-2 px-3 py-1 bg-success-50 rounded-full">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-sm text-success font-body font-body-medium">
                On the way
              </span>
            </div>
          </div>

          {/* Contact Actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handleCallDriver}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-smooth font-body font-body-medium"
            >
              <Icon name="Phone" size={18} />
              <span>Call</span>
            </button>
            
            <button
              onClick={handleMessageDriver}
              className="flex items-center space-x-2 px-4 py-2 border border-border text-text-secondary hover:text-primary hover:border-primary rounded-lg transition-smooth font-body font-body-medium"
            >
              <Icon name="MessageSquare" size={18} />
              <span>Message</span>
            </button>
          </div>
        </div>
      </div>

      {/* Driver Stats */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-heading font-heading-medium text-text-primary">
              1,247
            </p>
            <p className="text-sm text-text-secondary font-body">
              Deliveries
            </p>
          </div>
          <div>
            <p className="text-lg font-heading font-heading-medium text-text-primary">
              98%
            </p>
            <p className="text-sm text-text-secondary font-body">
              On Time
            </p>
          </div>
          <div>
            <p className="text-lg font-heading font-heading-medium text-text-primary">
              4.8
            </p>
            <p className="text-sm text-text-secondary font-body">
              Rating
            </p>
          </div>
        </div>
      </div>

      {/* Safety Features */}
      <div className="mt-4 p-3 bg-accent-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <Icon name="Shield" size={16} className="text-accent" />
          <span className="text-sm text-accent font-body font-body-medium">
            Verified driver with background check and insurance
          </span>
        </div>
      </div>
    </div>
  );
}

export default DriverDetails;