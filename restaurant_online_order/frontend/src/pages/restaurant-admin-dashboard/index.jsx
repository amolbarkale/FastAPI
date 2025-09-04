import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';
import AdminNavigation from 'components/ui/AdminNavigation';
import RecentActivity from './components/RecentActivity';
import SalesOverview from './components/SalesOverview';
import TopSellingItems from './components/TopSellingItems';
import OrderStatusChart from './components/OrderStatusChart';
import LocationPerformance from './components/LocationPerformance';
import CustomerSatisfaction from './components/CustomerSatisfaction';

function RestaurantAdminDashboard() {
  const [dateRange, setDateRange] = useState('week');
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    // Simulate data loading
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setDashboardData(mockDashboardData);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [dateRange]);

  const handleDateRangeChange = (range) => {
    setDateRange(range);
  };

  // Mock dashboard data
  const mockDashboardData = {
    summary: {
      totalSales: 28456.75,
      totalOrders: 427,
      averageOrderValue: 66.64,
      customerSatisfaction: 4.7
    },
    salesTrend: [
    { date: '2023-05-01', sales: 3200 },
    { date: '2023-05-02', sales: 3800 },
    { date: '2023-05-03', sales: 4200 },
    { date: '2023-05-04', sales: 3900 },
    { date: '2023-05-05', sales: 4800 },
    { date: '2023-05-06', sales: 5200 },
    { date: '2023-05-07', sales: 4600 }],

    topSellingItems: [
    { id: 1, name: 'Margherita Pizza', category: 'Pizza', sales: 89, revenue: 1424, growth: 12 },
    { id: 2, name: 'Chicken Alfredo Pasta', category: 'Pasta', sales: 76, revenue: 1216, growth: 8 },
    { id: 3, name: 'Classic Cheeseburger', category: 'Burgers', sales: 72, revenue: 864, growth: -3 },
    { id: 4, name: 'Caesar Salad', category: 'Salads', sales: 65, revenue: 780, growth: 15 },
    { id: 5, name: 'Chocolate Lava Cake', category: 'Desserts', sales: 58, revenue: 522, growth: 20 }],

    orderStatusDistribution: [
    { status: 'Completed', value: 380 },
    { status: 'In Progress', value: 27 },
    { status: 'Cancelled', value: 20 }],

    locationPerformance: [
    { id: 1, name: 'Downtown', orders: 187, sales: 12450, satisfaction: 4.8 },
    { id: 2, name: 'Westside', orders: 142, sales: 9320, satisfaction: 4.6 },
    { id: 3, name: 'Northgate', orders: 98, sales: 6686.75, satisfaction: 4.7 }],

    recentActivity: [
    {
      id: 1,
      type: 'order',
      title: 'New Order #ORD-7829',
      description: 'New order received from John D. for $78.50',
      timestamp: new Date(Date.now() - 5 * 60000),
      status: 'new'
    },
    {
      id: 2,
      type: 'inventory',
      title: 'Low Stock Alert',
      description: 'Chicken wings inventory below threshold (5 units remaining)',
      timestamp: new Date(Date.now() - 25 * 60000),
      status: 'warning'
    },
    {
      id: 3,
      type: 'review',
      title: 'New 5-Star Review',
      description: 'Sarah M. left a 5-star review for their recent order',
      timestamp: new Date(Date.now() - 120 * 60000),
      status: 'positive'
    },
    {
      id: 4,
      type: 'order',
      title: 'Order #ORD-7820 Completed',
      description: 'Order successfully delivered to customer',
      timestamp: new Date(Date.now() - 180 * 60000),
      status: 'success'
    },
    {
      id: 5,
      type: 'system',
      title: 'System Update',
      description: 'Menu pricing updated for 12 items',
      timestamp: new Date(Date.now() - 240 * 60000),
      status: 'info'
    }]

  };

  return (
    <div className="min-h-screen bg-background">
      <AdminNavigation />
      
      <div className="lg:pl-64 pt-16">
        <main className="p-4 md:p-6 lg:p-8">
          {/* Dashboard Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-heading font-heading-bold text-text-primary">
                  Restaurant Dashboard
                </h1>
                <p className="text-text-secondary font-body mt-1">
                  Overview of your restaurant's performance and operations
                </p>
              </div>
              
              {/* Date Range Selector */}
              <div className="mt-4 md:mt-0 flex items-center space-x-2 bg-surface rounded-lg border border-border p-1">
                {['day', 'week', 'month', 'year'].map((range) =>
                <button
                  key={range}
                  onClick={() => handleDateRangeChange(range)}
                  className={`px-4 py-2 text-sm font-body font-body-medium rounded-md transition-smooth ${
                  dateRange === range ?
                  'bg-primary text-white' : 'text-text-secondary hover:bg-primary-50 hover:text-primary'}`
                  }>

                    {range.charAt(0).toUpperCase() + range.slice(1)}
                  </button>
                )}
              </div>
            </div>
          </div>

          {isLoading ?
          <div className="flex items-center justify-center h-96">
              <div className="flex flex-col items-center">
                <Icon name="Loader2" size={48} className="text-primary animate-spin mb-4" />
                <p className="text-text-secondary font-body">Loading dashboard data...</p>
              </div>
            </div> :

          <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <SummaryCard
                title="Total Sales"
                value={`$${dashboardData.summary.totalSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                icon="DollarSign"
                trend={+8.2}
                color="primary" />

                <SummaryCard
                title="Total Orders"
                value={dashboardData.summary.totalOrders}
                icon="ShoppingBag"
                trend={+12.5}
                color="secondary" />

                <SummaryCard
                title="Average Order"
                value={`$${dashboardData.summary.averageOrderValue.toFixed(2)}`}
                icon="TrendingUp"
                trend={-2.1}
                color="accent" />

                <SummaryCard
                title="Customer Satisfaction"
                value={`${dashboardData.summary.customerSatisfaction}/5`}
                icon="Star"
                trend={+0.3}
                color="success" />

              </div>

              {/* Main Dashboard Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Sales Overview Chart - 2/3 width */}
                <div className="lg:col-span-2 bg-surface rounded-xl shadow-soft p-6">
                  <SalesOverview data={dashboardData.salesTrend} dateRange={dateRange} />
                </div>

                {/* Order Status Distribution - 1/3 width */}
                <div className="bg-surface rounded-xl shadow-soft p-6">
                  <OrderStatusChart data={dashboardData.orderStatusDistribution} />
                </div>
              </div>

              {/* Second Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Top Selling Items - 1/3 width */}
                <div className="bg-surface rounded-xl shadow-soft p-6">
                  <TopSellingItems items={dashboardData.topSellingItems} />
                </div>

                {/* Location Performance - 2/3 width */}
                <div className="lg:col-span-2 bg-surface rounded-xl shadow-soft p-6">
                  <LocationPerformance locations={dashboardData.locationPerformance} />
                </div>
              </div>

              {/* Third Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Recent Activity - 1/3 width */}
                <div className="bg-surface rounded-xl shadow-soft p-6">
                  <RecentActivity activities={dashboardData.recentActivity} />
                </div>

                {/* Customer Satisfaction - 2/3 width */}
                <div className="lg:col-span-2 bg-surface rounded-xl shadow-soft p-6">
                  <CustomerSatisfaction />
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-surface rounded-xl shadow-soft p-6 mb-8">
                <h2 className="text-xl font-heading font-heading-medium text-text-primary mb-4">
                  Quick Actions
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  <QuickActionCard
                  title="Menu Items"
                  icon="Utensils"
                  path="/admin-menu"
                  color="primary" />

                  <QuickActionCard
                  title="Orders"
                  icon="ShoppingBag"
                  path="/admin-orders"
                  color="secondary" />

                  <QuickActionCard
                  title="Customers"
                  icon="Users"
                  path="/admin-customers"
                  color="accent" />

                  <QuickActionCard
                  title="Kitchen"
                  icon="ChefHat"
                  path="/kitchen-display-system"
                  color="success" />

                  <QuickActionCard
                  title="Reports"
                  icon="BarChart2"
                  path="/reports"
                  color="warning" />

                  <QuickActionCard
                  title="Settings"
                  icon="Settings"
                  path="/admin-system-settings"
                  color="error" />

                </div>
              </div>
            </>
          }
        </main>

        {/* Footer */}
        <footer className="bg-surface border-t border-border p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <p className="text-sm text-text-secondary font-body">
                  &copy; {new Date().getFullYear()} RestaurantHub Pro. All rights reserved.
                </p>
              </div>
              <div className="flex space-x-4">
                <Link to="/admin-system-settings" className="text-sm text-text-secondary hover:text-primary transition-smooth">
                  System Settings
                </Link>
                <Link to="/admin-restaurant-settings" className="text-sm text-text-secondary hover:text-primary transition-smooth">
                  Restaurant Profile
                </Link>
                <a href="#" className="text-sm text-text-secondary hover:text-primary transition-smooth">
                  Help Center
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>);

}

// Summary Card Component
function SummaryCard({ title, value, icon, trend, color, dateRange }) {
  const getColorClass = (colorName) => {
    const colorMap = {
      primary: 'bg-primary-50 text-primary',
      secondary: 'bg-secondary-50 text-secondary',
      accent: 'bg-accent-50 text-accent',
      success: 'bg-success-50 text-success',
      warning: 'bg-warning-50 text-warning',
      error: 'bg-error-50 text-error'
    };
    return colorMap[colorName] || colorMap.primary;
  };

  const getTrendIcon = (trendValue) => {
    return trendValue >= 0 ? 'TrendingUp' : 'TrendingDown';
  };

  const getTrendColorClass = (trendValue) => {
    return trendValue >= 0 ? 'text-success' : 'text-error';
  };

  return (
    <div className="bg-surface rounded-xl shadow-soft p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-text-secondary font-body text-sm mb-1">{title}</p>
          <h3 className="text-2xl font-heading font-heading-bold text-text-primary">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${getColorClass(color)}`}>
          <Icon name={icon} size={24} />
        </div>
      </div>
      
      <div className="mt-4 flex items-center">
        <Icon
          name={getTrendIcon(trend)}
          size={16}
          className={getTrendColorClass(trend)} />

        <span className={`ml-1 text-sm font-body font-body-medium ${getTrendColorClass(trend)}`}>
          {Math.abs(trend)}%
        </span>
        <span className="ml-1 text-xs text-text-secondary font-body">
          vs. previous {dateRange}
        </span>
      </div>
    </div>);

}

// Quick Action Card Component
function QuickActionCard({ title, icon, path, color }) {
  const getColorClass = (colorName) => {
    const colorMap = {
      primary: 'bg-primary-50 text-primary hover:bg-primary hover:text-white',
      secondary: 'bg-secondary-50 text-secondary hover:bg-secondary hover:text-white',
      accent: 'bg-accent-50 text-accent hover:bg-accent hover:text-white',
      success: 'bg-success-50 text-success hover:bg-success hover:text-white',
      warning: 'bg-warning-50 text-warning hover:bg-warning hover:text-white',
      error: 'bg-error-50 text-error hover:bg-error hover:text-white'
    };
    return colorMap[colorName] || colorMap.primary;
  };

  return (
    <Link
      to={path}
      className={`flex flex-col items-center justify-center p-4 rounded-xl transition-smooth ${getColorClass(color)}`}>

      <Icon name={icon} size={28} />
      <span className="mt-2 text-sm font-body font-body-medium">{title}</span>
    </Link>);

}

export default RestaurantAdminDashboard;