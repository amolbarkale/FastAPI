import React from 'react';
import Icon from 'components/AppIcon';

function DeliveryMap({ order, driver }) {
  // Mock coordinates for demonstration
  const restaurantLocation = { lat: 40.7505, lng: -73.9934 };
  const customerLocation = { lat: 40.7589, lng: -73.9851 };
  const driverLocation = driver?.location || { lat: 40.7547, lng: -73.9892 };

  // Calculate estimated arrival time
  const getEstimatedArrival = () => {
    const now = new Date();
    const estimatedMinutes = Math.floor(Math.random() * 15) + 10; // 10-25 minutes
    const arrivalTime = new Date(now.getTime() + estimatedMinutes * 60000);
    return arrivalTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden">
      {/* Map Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-heading font-heading-medium text-text-primary">
            Live Tracking
          </h3>
          {order.status === 'out_for_delivery' && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-sm text-success font-body font-body-medium">
                En Route
              </span>
            </div>
          )}
        </div>
        
        {order.status === 'out_for_delivery' && (
          <p className="text-sm text-text-secondary font-body mt-2">
            Estimated arrival: {getEstimatedArrival()}
          </p>
        )}
      </div>

      {/* Map Container */}
      <div className="relative h-64 sm:h-80 bg-secondary-50">
        {/* Google Maps Embed */}
        <iframe
          width="100%"
          height="100%"
          loading="lazy"
          title="Delivery Tracking Map"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps?q=${customerLocation.lat},${customerLocation.lng}&z=14&output=embed`}
          className="border-0"
        ></iframe>

        {/* Map Overlay Info */}
        <div className="absolute top-4 left-4 right-4">
          <div className="bg-surface rounded-lg shadow-floating p-4 border border-border">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              {/* Restaurant */}
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <div>
                  <p className="font-body font-body-medium text-text-primary">Restaurant</p>
                  <p className="text-text-secondary font-body">{order.restaurant.name}</p>
                </div>
              </div>

              {/* Driver (if out for delivery) */}
              {order.status === 'out_for_delivery' && driver && (
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                  <div>
                    <p className="font-body font-body-medium text-text-primary">Driver</p>
                    <p className="text-text-secondary font-body">{driver.name}</p>
                  </div>
                </div>
              )}

              {/* Customer */}
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-accent rounded-full"></div>
                <div>
                  <p className="font-body font-body-medium text-text-primary">Your Location</p>
                  <p className="text-text-secondary font-body">Delivery Address</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Distance and Time Info */}
        {order.status === 'out_for_delivery' && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-surface rounded-lg shadow-floating p-4 border border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon name="Navigation" size={20} className="text-primary" />
                  <div>
                    <p className="font-body font-body-medium text-text-primary">
                      2.3 miles away
                    </p>
                    <p className="text-sm text-text-secondary font-body">
                      Approximately 12 minutes
                    </p>
                  </div>
                </div>
                <button className="flex items-center space-x-2 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-smooth font-body font-body-medium text-sm">
                  <Icon name="Phone" size={16} />
                  <span>Call Driver</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Map Actions */}
      <div className="p-4 bg-secondary-50 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 text-primary hover:text-primary-700 transition-smooth font-body font-body-medium text-sm">
              <Icon name="RotateCcw" size={16} />
              <span>Refresh</span>
            </button>
            <button className="flex items-center space-x-2 text-primary hover:text-primary-700 transition-smooth font-body font-body-medium text-sm">
              <Icon name="Maximize" size={16} />
              <span>Full Screen</span>
            </button>
          </div>
          <button className="flex items-center space-x-2 text-primary hover:text-primary-700 transition-smooth font-body font-body-medium text-sm">
            <Icon name="Share" size={16} />
            <span>Share Location</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeliveryMap;