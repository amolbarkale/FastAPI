import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from 'components/AppIcon';

function CustomerSatisfaction() {
  const [selectedMetric, setSelectedMetric] = useState('overall');

  // Mock data for customer satisfaction metrics
  const satisfactionData = {
    overall: [
      { date: '2023-05-01', rating: 4.5 },
      { date: '2023-05-02', rating: 4.6 },
      { date: '2023-05-03', rating: 4.7 },
      { date: '2023-05-04', rating: 4.5 },
      { date: '2023-05-05', rating: 4.8 },
      { date: '2023-05-06', rating: 4.7 },
      { date: '2023-05-07', rating: 4.9 }
    ],
    food: [
      { date: '2023-05-01', rating: 4.7 },
      { date: '2023-05-02', rating: 4.8 },
      { date: '2023-05-03', rating: 4.9 },
      { date: '2023-05-04', rating: 4.7 },
      { date: '2023-05-05', rating: 4.9 },
      { date: '2023-05-06', rating: 4.8 },
      { date: '2023-05-07', rating: 5.0 }
    ],
    service: [
      { date: '2023-05-01', rating: 4.3 },
      { date: '2023-05-02', rating: 4.4 },
      { date: '2023-05-03', rating: 4.5 },
      { date: '2023-05-04', rating: 4.3 },
      { date: '2023-05-05', rating: 4.7 },
      { date: '2023-05-06', rating: 4.6 },
      { date: '2023-05-07', rating: 4.8 }
    ],
    delivery: [
      { date: '2023-05-01', rating: 4.2 },
      { date: '2023-05-02', rating: 4.3 },
      { date: '2023-05-03', rating: 4.4 },
      { date: '2023-05-04', rating: 4.1 },
      { date: '2023-05-05', rating: 4.5 },
      { date: '2023-05-06', rating: 4.4 },
      { date: '2023-05-07', rating: 4.6 }
    ]
  };

  // Mock feedback data
  const recentFeedback = [
    {
      id: 1,
      customer: 'Sarah M.',
      rating: 5,
      comment: 'The food was amazing and delivery was right on time. Will definitely order again!',
      date: '2023-05-07'
    },
    {
      id: 2,
      customer: 'Michael T.',
      rating: 4,
      comment: 'Great food but the delivery took a bit longer than expected.',
      date: '2023-05-06'
    },
    {
      id: 3,
      customer: 'Jessica L.',
      rating: 5,
      comment: 'Best pasta I\'ve had in a long time. The packaging was also excellent.',
      date: '2023-05-05'
    }
  ];

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface p-3 border border-border rounded-lg shadow-floating">
          <p className="font-body font-body-medium text-text-primary mb-1">
            {formatDate(label)}
          </p>
          <p className="text-sm font-body">
            <span className="text-primary font-body-medium">Rating:</span> {payload[0].value.toFixed(1)}/5.0
          </p>
        </div>
      );
    }
    return null;
  };

  // Get metric display name
  const getMetricName = (metric) => {
    const metricNames = {
      overall: 'Overall Satisfaction',
      food: 'Food Quality',
      service: 'Service Quality',
      delivery: 'Delivery Experience'
    };
    return metricNames[metric] || 'Satisfaction';
  };

  // Get line color based on metric
  const getLineColor = (metric) => {
    const colorMap = {
      overall: 'var(--color-primary)',
      food: 'var(--color-success)',
      service: 'var(--color-accent)',
      delivery: 'var(--color-secondary)'
    };
    return colorMap[metric] || 'var(--color-primary)';
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading font-heading-medium text-text-primary">
            Customer Satisfaction
          </h2>
          <p className="text-sm text-text-secondary font-body mt-1">
            Tracking customer experience metrics
          </p>
        </div>
        
        <div className="mt-3 sm:mt-0 flex items-center space-x-2 bg-surface rounded-lg border border-border p-1">
          {Object.keys(satisfactionData).map((metric) => (
            <button
              key={metric}
              onClick={() => setSelectedMetric(metric)}
              className={`px-3 py-1.5 text-xs font-body font-body-medium rounded-md transition-smooth ${
                selectedMetric === metric
                  ? 'bg-primary text-white' :'text-text-secondary hover:bg-primary-50 hover:text-primary'
              }`}
            >
              {metric.charAt(0).toUpperCase() + metric.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Satisfaction Chart */}
        <div className="lg:col-span-2">
          <div className="h-64" aria-label={`${getMetricName(selectedMetric)} Chart`}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={satisfactionData[selectedMetric]}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                  stroke="var(--color-text-secondary)"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  domain={[3, 5]} 
                  ticks={[3, 3.5, 4, 4.5, 5]}
                  stroke="var(--color-text-secondary)"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="rating" 
                  stroke={getLineColor(selectedMetric)} 
                  strokeWidth={2}
                  dot={{ r: 4, fill: getLineColor(selectedMetric) }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Metrics Summary */}
          <div className="grid grid-cols-4 gap-4 mt-4">
            <MetricCard 
              title="Average" 
              value={(satisfactionData[selectedMetric].reduce((sum, item) => sum + item.rating, 0) / satisfactionData[selectedMetric].length).toFixed(1)}
              icon="Star"
            />
            <MetricCard 
              title="Highest" 
              value={Math.max(...satisfactionData[selectedMetric].map(item => item.rating)).toFixed(1)}
              icon="TrendingUp"
            />
            <MetricCard 
              title="Lowest" 
              value={Math.min(...satisfactionData[selectedMetric].map(item => item.rating)).toFixed(1)}
              icon="TrendingDown"
            />
            <MetricCard 
              title="Reviews" 
              value={satisfactionData[selectedMetric].length}
              icon="MessageSquare"
            />
          </div>
        </div>

        {/* Recent Feedback */}
        <div>
          <h3 className="text-lg font-heading font-heading-medium text-text-primary mb-3">
            Recent Feedback
          </h3>
          
          <div className="space-y-4">
            {recentFeedback.map((feedback) => (
              <div key={feedback.id} className="p-3 bg-secondary-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-body font-body-medium text-text-primary">
                    {feedback.customer}
                  </span>
                  <div className="flex items-center">
                    <span className="text-sm font-body mr-1">{feedback.rating}</span>
                    <Icon name="Star" size={14} className="text-warning" />
                  </div>
                </div>
                <p className="text-sm text-text-secondary font-body mb-2">
                  {feedback.comment}
                </p>
                <p className="text-xs text-text-secondary font-body">
                  {formatDate(feedback.date)}
                </p>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 flex items-center justify-center space-x-2 px-4 py-2 border border-border text-text-secondary hover:text-primary hover:border-primary rounded-lg transition-smooth font-body font-body-medium">
            <Icon name="MessageSquare" size={16} />
            <span>View All Feedback</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Metric Card Component
function MetricCard({ title, value, icon }) {
  return (
    <div className="bg-surface border border-border rounded-lg p-3 text-center">
      <p className="text-text-secondary font-body text-xs mb-1">{title}</p>
      <div className="flex items-center justify-center">
        <Icon name={icon} size={16} className="text-primary mr-1" />
        <span className="text-lg font-heading font-heading-medium text-text-primary">{value}</span>
      </div>
    </div>
  );
}

export default CustomerSatisfaction;