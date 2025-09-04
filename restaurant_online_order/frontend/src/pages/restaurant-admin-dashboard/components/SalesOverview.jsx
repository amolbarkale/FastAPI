import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function SalesOverview({ data, dateRange }) {
  // Format date based on the selected date range
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    
    switch(dateRange) {
      case 'day':
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      case 'week':
        return date.toLocaleDateString('en-US', { weekday: 'short' });
      case 'month':
        return date.toLocaleDateString('en-US', { day: 'numeric' });
      case 'year':
        return date.toLocaleDateString('en-US', { month: 'short' });
      default:
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  // Format currency for tooltip
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface p-3 border border-border rounded-lg shadow-floating">
          <p className="font-body font-body-medium text-text-primary mb-1">{formatDate(label)}</p>
          <p className="text-primary font-body">
            Sales: {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-heading-medium text-text-primary">
          Sales Overview
        </h2>
        <div className="text-sm font-body text-text-secondary">
          {dateRange === 'day' && 'Today'}
          {dateRange === 'week' && 'This Week'}
          {dateRange === 'month' && 'This Month'}
          {dateRange === 'year' && 'This Year'}
        </div>
      </div>

      <div className="h-80" aria-label="Sales Overview Chart">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              stroke="var(--color-text-secondary)"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tickFormatter={(value) => `$${value}`}
              stroke="var(--color-text-secondary)"
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="sales" 
              stroke="var(--color-primary)" 
              fillOpacity={1} 
              fill="url(#colorSales)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="text-center">
          <p className="text-text-secondary font-body text-sm">Total Sales</p>
          <p className="text-xl font-heading font-heading-medium text-text-primary">
            {formatCurrency(data.reduce((sum, item) => sum + item.sales, 0))}
          </p>
        </div>
        <div className="text-center">
          <p className="text-text-secondary font-body text-sm">Average</p>
          <p className="text-xl font-heading font-heading-medium text-text-primary">
            {formatCurrency(data.reduce((sum, item) => sum + item.sales, 0) / data.length)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-text-secondary font-body text-sm">Peak Day</p>
          <p className="text-xl font-heading font-heading-medium text-text-primary">
            {formatDate(data.reduce((max, item) => item.sales > max.sales ? item : max, data[0]).date)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default SalesOverview;