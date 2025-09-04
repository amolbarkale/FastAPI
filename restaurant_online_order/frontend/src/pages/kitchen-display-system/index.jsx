// src/pages/kitchen-display-system/index.jsx
import React, { useState, useEffect, useCallback } from 'react';
import Icon from 'components/AppIcon';
import KitchenInterface from 'components/ui/KitchenInterface';

import StationFilter from './components/StationFilter';
import OrderStatusColumn from './components/OrderStatusColumn';
import PerformanceMetrics from './components/PerformanceMetrics';
import OrderModificationAlert from './components/OrderModificationAlert';

function KitchenDisplaySystem() {
  const [orders, setOrders] = useState([]);
  const [selectedStation, setSelectedStation] = useState('all');
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [isLoading, setIsLoading] = useState(true);
  const [modifiedOrders, setModifiedOrders] = useState([]);
  const [showMetrics, setShowMetrics] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Mock WebSocket connection status
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Load initial orders data
  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setOrders(mockOrdersData);
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  // Handle order status updates
  const handleOrderStatusUpdate = useCallback((orderId, newStatus) => {
    setOrders(prevOrders =>
      prevOrders?.map(order =>
        order?.id === orderId ? { ...order, status: newStatus, lastUpdated: new Date() } : order
      )
    );
  }, []);

  // Handle order priority updates
  const handleOrderPriorityUpdate = useCallback((orderId, newPriority) => {
    setOrders(prevOrders =>
      prevOrders?.map(order =>
        order?.id === orderId ? { ...order, priority: newPriority } : order
      )
    );
  }, []);

  // Handle item completion toggle
  const handleItemToggle = useCallback((orderId, itemId) => {
    setOrders(prevOrders =>
      prevOrders?.map(order => {
        if (order?.id === orderId) {
          return {
            ...order,
            items: order?.items?.map(item =>
              item?.id === itemId ? { ...item, completed: !item?.completed } : item
            )
          };
        }
        return order;
      })
    );
  }, []);

  // Filter orders by station
  const filteredOrders = orders?.filter(order => {
    if (selectedStation === 'all') return true;
    return order?.station === selectedStation;
  }) || [];

  // Group orders by status
  const ordersByStatus = {
    new: filteredOrders?.filter(order => order?.status === 'new') || [],
    'in-progress': filteredOrders?.filter(order => order?.status === 'in-progress') || [],
    ready: filteredOrders?.filter(order => order?.status === 'ready') || [],
    completed: filteredOrders?.filter(order => order?.status === 'completed') || []
  };

  // Calculate performance metrics
  const performanceMetrics = {
    averagePrepTime: 12.5,
    completionRate: 94.2,
    activeOrders: filteredOrders?.filter(order => order?.status !== 'completed')?.length || 0,
    totalOrders: filteredOrders?.length || 0
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Icon name="Loader2" size={48} className="text-primary animate-spin mb-4" />
          <p className="text-text-secondary font-body">Loading kitchen display system...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <KitchenInterface />
      
      <div className="pt-20 p-4 lg:p-6">
        {/* Kitchen Header */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-heading font-heading-bold text-text-primary">
                Kitchen Display System
              </h1>
              <p className="text-text-secondary font-body mt-1">
                Real-time order management and preparation coordination
              </p>
            </div>
            
            {/* Header Actions */}
            <div className="mt-4 lg:mt-0 flex items-center space-x-4">
              <button
                onClick={() => setShowMetrics(!showMetrics)}
                className={`px-4 py-2 rounded-lg font-body font-body-medium transition-smooth ${
                  showMetrics
                    ? 'bg-primary text-white' :'bg-surface text-text-secondary hover:bg-primary-50 hover:text-primary border border-border'
                }`}
              >
                <Icon name="BarChart3" size={16} className="mr-2" />
                Metrics
              </button>
              
              <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                connectionStatus === 'connected' ? 'bg-success-50 text-success' :
                connectionStatus === 'disconnected'? 'bg-error-50 text-error' : 'bg-warning-50 text-warning'
              }`}>
                <Icon
                  name={connectionStatus === 'connected' ? 'Wifi' : connectionStatus === 'disconnected' ? 'WifiOff' : 'RotateCw'}
                  size={16}
                  className={connectionStatus === 'reconnecting' ? 'animate-spin' : ''}
                />
                <span className="text-sm font-body font-body-medium capitalize">
                  {connectionStatus}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Station Filter */}
        <StationFilter
          selectedStation={selectedStation}
          onStationChange={setSelectedStation}
          orderCounts={{
            all: orders?.length || 0,
            grill: orders?.filter(order => order?.station === 'grill')?.length || 0,
            fryer: orders?.filter(order => order?.station === 'fryer')?.length || 0,
            salad: orders?.filter(order => order?.station === 'salad')?.length || 0,
            beverages: orders?.filter(order => order?.station === 'beverages')?.length || 0
          }}
        />

        {/* Performance Metrics */}
        {showMetrics && (
          <PerformanceMetrics metrics={performanceMetrics} className="mb-6" />
        )}

        {/* Order Modification Alerts */}
        {modifiedOrders?.length > 0 && (
          <OrderModificationAlert
            orders={modifiedOrders}
            onDismiss={(orderId) => {
              setModifiedOrders(prev => prev?.filter(order => order?.id !== orderId) || []);
            }}
            className="mb-6"
          />
        )}

        {/* Orders Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <OrderStatusColumn
            title="New Orders"
            status="new"
            orders={ordersByStatus.new}
            onOrderStatusUpdate={handleOrderStatusUpdate}
            onOrderPriorityUpdate={handleOrderPriorityUpdate}
            onItemToggle={handleItemToggle}
            currentTime={currentTime}
            color="accent"
          />
          
          <OrderStatusColumn
            title="In Progress"
            status="in-progress"
            orders={ordersByStatus['in-progress']}
            onOrderStatusUpdate={handleOrderStatusUpdate}
            onOrderPriorityUpdate={handleOrderPriorityUpdate}
            onItemToggle={handleItemToggle}
            currentTime={currentTime}
            color="warning"
          />
          
          <OrderStatusColumn
            title="Ready"
            status="ready"
            orders={ordersByStatus.ready}
            onOrderStatusUpdate={handleOrderStatusUpdate}
            onOrderPriorityUpdate={handleOrderPriorityUpdate}
            onItemToggle={handleItemToggle}
            currentTime={currentTime}
            color="primary"
          />
          
          <OrderStatusColumn
            title="Completed"
            status="completed"
            orders={ordersByStatus.completed}
            onOrderStatusUpdate={handleOrderStatusUpdate}
            onOrderPriorityUpdate={handleOrderPriorityUpdate}
            onItemToggle={handleItemToggle}
            currentTime={currentTime}
            color="success"
          />
        </div>
      </div>
    </div>
  );
}

// Mock orders data
const mockOrdersData = [
  {
    id: 'ORD-8901',
    number: '8901',
    customerName: 'John Smith',
    timestamp: new Date(Date.now() - 5 * 60000),
    deliveryMethod: 'dine-in',
    estimatedTime: 15,
    status: 'new',
    priority: 'normal',
    station: 'grill',
    tableNumber: '12',
    lastUpdated: new Date(),
    items: [
      {
        id: 1,
        name: 'Classic Cheeseburger',
        quantity: 2,
        specialInstructions: 'No onions, extra cheese',
        completed: false
      },
      {
        id: 2,
        name: 'French Fries',
        quantity: 2,
        specialInstructions: 'Extra crispy',
        completed: false
      }
    ]
  },
  {
    id: 'ORD-8902',
    number: '8902',
    customerName: 'Sarah Johnson',
    timestamp: new Date(Date.now() - 12 * 60000),
    deliveryMethod: 'delivery',
    estimatedTime: 25,
    status: 'in-progress',
    priority: 'high',
    station: 'grill',
    address: '123 Main St, Apt 4B',
    lastUpdated: new Date(),
    items: [
      {
        id: 3,
        name: 'Margherita Pizza',
        quantity: 1,
        specialInstructions: 'Light cheese, extra basil',
        completed: true
      },
      {
        id: 4,
        name: 'Caesar Salad',
        quantity: 1,
        specialInstructions: 'Dressing on the side',
        completed: false
      }
    ]
  },
  {
    id: 'ORD-8903',
    number: '8903',
    customerName: 'Mike Davis',
    timestamp: new Date(Date.now() - 8 * 60000),
    deliveryMethod: 'pickup',
    estimatedTime: 10,
    status: 'ready',
    priority: 'normal',
    station: 'fryer',
    lastUpdated: new Date(),
    items: [
      {
        id: 5,
        name: 'Chicken Wings',
        quantity: 12,
        specialInstructions: 'Buffalo sauce, extra hot',
        completed: true
      },
      {
        id: 6,
        name: 'Onion Rings',
        quantity: 1,
        specialInstructions: '',
        completed: true
      }
    ]
  },
  {
    id: 'ORD-8904',
    number: '8904',
    customerName: 'Emily Chen',
    timestamp: new Date(Date.now() - 25 * 60000),
    deliveryMethod: 'dine-in',
    estimatedTime: 20,
    status: 'completed',
    priority: 'normal',
    station: 'salad',
    tableNumber: '8',
    lastUpdated: new Date(),
    items: [
      {
        id: 7,
        name: 'Greek Salad',
        quantity: 1,
        specialInstructions: 'No olives',
        completed: true
      },
      {
        id: 8,
        name: 'Iced Tea',
        quantity: 2,
        specialInstructions: 'Extra lemon',
        completed: true
      }
    ]
  },
  {
    id: 'ORD-8905',
    number: '8905',
    customerName: 'David Wilson',
    timestamp: new Date(Date.now() - 3 * 60000),
    deliveryMethod: 'delivery',
    estimatedTime: 30,
    status: 'new',
    priority: 'urgent',
    station: 'grill',
    address: '456 Oak Ave',
    lastUpdated: new Date(),
    items: [
      {
        id: 9,
        name: 'BBQ Bacon Burger',
        quantity: 1,
        specialInstructions: 'Medium rare, no pickles',
        completed: false
      },
      {
        id: 10,
        name: 'Sweet Potato Fries',
        quantity: 1,
        specialInstructions: '',
        completed: false
      },
      {
        id: 11,
        name: 'Chocolate Milkshake',
        quantity: 1,
        specialInstructions: 'Extra whipped cream',
        completed: false
      }
    ]
  },
  {
    id: 'ORD-8906',
    number: '8906',
    customerName: 'Lisa Brown',
    timestamp: new Date(Date.now() - 18 * 60000),
    deliveryMethod: 'pickup',
    estimatedTime: 15,
    status: 'in-progress',
    priority: 'normal',
    station: 'beverages',
    lastUpdated: new Date(),
    items: [
      {
        id: 12,
        name: 'Cappuccino',
        quantity: 2,
        specialInstructions: 'Extra foam',
        completed: true
      },
      {
        id: 13,
        name: 'Blueberry Muffin',
        quantity: 2,
        specialInstructions: 'Warmed',
        completed: false
      }
    ]
  }
];

export default KitchenDisplaySystem;