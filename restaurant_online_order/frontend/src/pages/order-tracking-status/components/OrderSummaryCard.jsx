import React from 'react';
import Icon from 'components/AppIcon';

function OrderSummaryCard({ order }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatOrderTime = (timestamp) => {
    return timestamp.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="bg-surface rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-heading font-heading-medium text-text-primary">
          Order Summary
        </h3>
        <span className="text-sm text-text-secondary font-body">
          {formatOrderTime(order.orderTime)}
        </span>
      </div>

      {/* Order Items */}
      <div className="space-y-4 mb-6">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-body font-body-medium text-sm">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-body font-body-medium text-text-primary">
                    {item.name}
                  </h4>
                  {item.variant && (
                    <p className="text-sm text-text-secondary font-body">
                      {item.variant}
                    </p>
                  )}
                  {item.customizations.length > 0 && (
                    <div className="mt-1">
                      {item.customizations.map((customization, index) => (
                        <span
                          key={index}
                          className="inline-block text-xs text-text-secondary font-body bg-secondary-50 px-2 py-1 rounded mr-1 mb-1"
                        >
                          {customization}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <span className="font-body font-body-medium text-text-primary">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Totals */}
      <div className="border-t border-border pt-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary font-body">Subtotal</span>
          <span className="text-text-primary font-body">{formatPrice(order.subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary font-body">Tax</span>
          <span className="text-text-primary font-body">{formatPrice(order.tax)}</span>
        </div>
        {order.deliveryFee > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary font-body">Delivery Fee</span>
            <span className="text-text-primary font-body">{formatPrice(order.deliveryFee)}</span>
          </div>
        )}
        {order.tip > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary font-body">Tip</span>
            <span className="text-text-primary font-body">{formatPrice(order.tip)}</span>
          </div>
        )}
        <div className="flex items-center justify-between text-lg font-heading font-heading-medium pt-2 border-t border-border">
          <span className="text-text-primary">Total</span>
          <span className="text-text-primary">{formatPrice(order.total)}</span>
        </div>
      </div>

      {/* Payment Method */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center space-x-3">
          <Icon name="CreditCard" size={20} className="text-text-secondary" />
          <div>
            <p className="text-sm text-text-secondary font-body">Payment Method</p>
            <p className="font-body font-body-medium text-text-primary">
              {order.paymentMethod}
            </p>
          </div>
        </div>
      </div>

      {/* Delivery Address */}
      {order.type === 'delivery' && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-start space-x-3">
            <Icon name="MapPin" size={20} className="text-text-secondary mt-0.5" />
            <div>
              <p className="text-sm text-text-secondary font-body">Delivery Address</p>
              <p className="font-body font-body-medium text-text-primary">
                {order.customer.address}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderSummaryCard;