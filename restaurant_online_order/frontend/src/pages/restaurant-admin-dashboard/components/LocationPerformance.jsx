import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from 'components/AppIcon';

function LocationPerformance({ locations }) {
  // Format currency for display
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const location = locations.find(loc => loc.name === label);
      
      return (
        <div className="bg-surface p-3 border border-border rounded-lg shadow-floating">
          <p className="font-body font-body-medium text-text-primary mb-2">
            {label} Location
          </p>
          <div className="space-y-1 text-sm">
            <p className="font-body">
              <span className="text-primary font-body-medium">Sales:</span> {formatCurrency(payload[0].value)}
            </p>
            <p className="font-body">
              <span className="text-primary font-body-medium">Orders:</span> {location.orders}
            </p>
            <p className="font-body">
              <span className="text-primary font-body-medium">Satisfaction:</span> {location.satisfaction}/5
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Prepare data for chart
  const chartData = locations.map(location => ({
    name: location.name,
    sales: location.sales
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-heading font-heading-medium text-text-primary">
            Location Performance
          </h2>
          <p className="text-sm text-text-secondary font-body mt-1">
            Sales comparison across restaurant locations
          </p>
        </div>
        <button className="p-2 text-text-secondary hover:text-primary hover:bg-primary-50 rounded-lg transition-smooth">
          <Icon name="Filter" size={18} />
        </button>
      </div>

      <div className="h-64 mb-6" aria-label="Location Performance Chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="name" 
              stroke="var(--color-text-secondary)"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tickFormatter={(value) => `$${value/1000}k`}
              stroke="var(--color-text-secondary)"
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="sales" 
              fill="var(--color-primary)" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Location Details Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-2 text-sm font-body font-body-medium text-text-secondary">Location</th>
              <th className="pb-2 text-sm font-body font-body-medium text-text-secondary text-right">Orders</th>
              <th className="pb-2 text-sm font-body font-body-medium text-text-secondary text-right">Sales</th>
              <th className="pb-2 text-sm font-body font-body-medium text-text-secondary text-right">Rating</th>
            </tr>
          </thead>
          <tbody>
            {locations.map((location) => (
              <tr key={location.id} className="border-b border-border-light hover:bg-secondary-50">
                <td className="py-3 text-sm font-body text-text-primary">{location.name}</td>
                <td className="py-3 text-sm font-body text-text-primary text-right">{location.orders}</td>
                <td className="py-3 text-sm font-body text-text-primary text-right">{formatCurrency(location.sales)}</td>
                <td className="py-3 text-sm font-body text-text-primary text-right">
                  <div className="flex items-center justify-end">
                    <span className="mr-1">{location.satisfaction}</span>
                    <Icon name="Star" size={14} className="text-warning" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LocationPerformance;