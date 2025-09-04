import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

function OrderStatusChart({ data }) {
  // Colors for different order statuses
  const COLORS = ['#27AE60', '#F39C12', '#E74C3C'];
  
  // Calculate total orders
  const totalOrders = data.reduce((sum, item) => sum + item.value, 0);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      const percentage = ((item.value / totalOrders) * 100).toFixed(1);
      
      return (
        <div className="bg-surface p-3 border border-border rounded-lg shadow-floating">
          <p className="font-body font-body-medium text-text-primary mb-1">
            {item.name}
          </p>
          <p className="text-sm font-body">
            <span className="font-body-medium">{item.value}</span> orders ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom legend component
  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm font-body text-text-secondary">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-heading font-heading-medium text-text-primary">
          Order Status
        </h2>
        <p className="text-sm text-text-secondary font-body mt-1">
          Distribution of current order statuses
        </p>
      </div>

      <div className="h-64" aria-label="Order Status Distribution Chart">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              innerRadius={40}
              dataKey="value"
              nameKey="status"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        {data.map((item, index) => (
          <div key={index} className="p-2">
            <p className="text-2xl font-heading font-heading-medium" style={{ color: COLORS[index] }}>
              {item.value}
            </p>
            <p className="text-xs text-text-secondary font-body truncate">
              {item.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderStatusChart;