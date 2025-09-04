import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';

function OrderActions({ order, onReorder, onContactSupport, onRateOrder }) {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);

  const handleCancelOrder = () => {
    setShowCancelModal(true);
  };

  const confirmCancelOrder = () => {
    console.log("Order cancelled");
    setShowCancelModal(false);
  };

  const handleShareOrder = () => {
    if (navigator.share) {
      navigator.share({
        title: `Order ${order.id} - TasteBite`,
        text: `Track my order from ${order.restaurant.name}`,
        url: window.location.href
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      console.log("Order link copied to clipboard");
    }
  };

  const canModifyOrder = order.canModify && (order.status === 'confirmed' || order.status === 'preparing');
  const canCancelOrder = order.canCancel && (order.status === 'confirmed' || order.status === 'preparing');
  const canRateOrder = order.status === 'delivered';

  return (
    <>
      <div className="bg-surface rounded-xl border border-border p-6">
        <h3 className="text-lg font-heading font-heading-medium text-text-primary mb-4">
          Order Actions
        </h3>

        <div className="space-y-3">
          {/* Reorder */}
          <button
            onClick={onReorder}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-700 transition-smooth font-body font-body-medium"
          >
            <Icon name="RotateCcw" size={20} />
            <span>Reorder Items</span>
          </button>

          {/* Rate Order (if delivered) */}
          {canRateOrder && (
            <button
              onClick={() => setShowRatingModal(true)}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-accent text-white rounded-lg hover:bg-accent-600 transition-smooth font-body font-body-medium"
            >
              <Icon name="Star" size={20} />
              <span>Rate Your Order</span>
            </button>
          )}

          {/* Modify Order (if allowed) */}
          {canModifyOrder && (
            <Link
              to="/item-detail-customization"
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-border text-text-secondary hover:text-primary hover:border-primary rounded-lg transition-smooth font-body font-body-medium"
            >
              <Icon name="Edit" size={20} />
              <span>Modify Order</span>
            </Link>
          )}

          {/* Cancel Order (if allowed) */}
          {canCancelOrder && (
            <button
              onClick={handleCancelOrder}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-error text-error hover:bg-error-50 rounded-lg transition-smooth font-body font-body-medium"
            >
              <Icon name="X" size={20} />
              <span>Cancel Order</span>
            </button>
          )}

          {/* Contact Support */}
          <button
            onClick={onContactSupport}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-border text-text-secondary hover:text-primary hover:border-primary rounded-lg transition-smooth font-body font-body-medium"
          >
            <Icon name="MessageCircle" size={20} />
            <span>Contact Support</span>
          </button>

          {/* Share Order */}
          <button
            onClick={handleShareOrder}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-border text-text-secondary hover:text-primary hover:border-primary rounded-lg transition-smooth font-body font-body-medium"
          >
            <Icon name="Share" size={20} />
            <span>Share Order Status</span>
          </button>
        </div>

        {/* Quick Links */}
        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-sm text-text-secondary font-body mb-3">Quick Links</p>
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/menu-browse-search"
              className="flex items-center space-x-2 px-3 py-2 text-sm text-primary hover:bg-primary-50 rounded-lg transition-smooth font-body font-body-medium"
            >
              <Icon name="ChefHat" size={16} />
              <span>Browse Menu</span>
            </Link>
            <Link
              to="/customer-account-order-history"
              className="flex items-center space-x-2 px-3 py-2 text-sm text-primary hover:bg-primary-50 rounded-lg transition-smooth font-body font-body-medium"
            >
              <Icon name="History" size={16} />
              <span>Order History</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-modal flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-secondary-900 bg-opacity-50" onClick={() => setShowCancelModal(false)}></div>
          <div className="relative bg-surface rounded-2xl shadow-floating max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-error-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="AlertTriangle" size={32} className="text-error" />
              </div>
              <h3 className="text-xl font-heading font-heading-medium text-text-primary mb-2">
                Cancel Order?
              </h3>
              <p className="text-text-secondary font-body mb-6">
                Are you sure you want to cancel this order? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 px-4 py-2 border border-border text-text-secondary hover:text-primary hover:border-primary rounded-lg transition-smooth font-body font-body-medium"
                >
                  Keep Order
                </button>
                <button
                  onClick={confirmCancelOrder}
                  className="flex-1 px-4 py-2 bg-error text-white rounded-lg hover:bg-error-600 transition-smooth font-body font-body-medium"
                >
                  Cancel Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 z-modal flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-secondary-900 bg-opacity-50" onClick={() => setShowRatingModal(false)}></div>
          <div className="relative bg-surface rounded-2xl shadow-floating max-w-md w-full p-6">
            <div className="text-center">
              <h3 className="text-xl font-heading font-heading-medium text-text-primary mb-4">
                Rate Your Order
              </h3>
              <p className="text-text-secondary font-body mb-6">
                How was your experience with {order.restaurant.name}?
              </p>
              
              {/* Star Rating */}
              <div className="flex justify-center space-x-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className="p-1 text-warning hover:scale-110 transition-transform"
                  >
                    <Icon name="Star" size={32} className="fill-current" />
                  </button>
                ))}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowRatingModal(false)}
                  className="flex-1 px-4 py-2 border border-border text-text-secondary hover:text-primary hover:border-primary rounded-lg transition-smooth font-body font-body-medium"
                >
                  Skip
                </button>
                <button
                  onClick={() => {
                    onRateOrder();
                    setShowRatingModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-smooth font-body font-body-medium"
                >
                  Submit Rating
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default OrderActions;