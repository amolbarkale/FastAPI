import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CustomerNavigation from 'components/ui/CustomerNavigation';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

function ItemDetailCustomization() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('medium');
  const [spiceLevel, setSpiceLevel] = useState(2);
  const [quantity, setQuantity] = useState(1);
  const [selectedIngredients, setSelectedIngredients] = useState({});
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [showNutrition, setShowNutrition] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(3);

  // Mock item data - would come from props/state in real app
  const mockItem = {
    id: 'item-001',
    name: 'Margherita Pizza',
    description: `A classic Italian pizza featuring fresh mozzarella cheese, ripe tomatoes, and aromatic basil leaves on our signature thin-crust base. Made with San Marzano tomatoes and buffalo mozzarella for an authentic taste that transports you straight to Naples.

Our dough is prepared fresh daily using traditional techniques and aged for 24 hours to develop complex flavors. Each pizza is hand-stretched and baked in our wood-fired oven at 900°F for the perfect crispy yet chewy texture.`,
    basePrice: 18.99,
    prepTime: '15-20 mins',
    rating: 4.7,
    reviewCount: 342,
    images: [
      'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=600&fit=crop'
    ],
    sizes: [
      { id: 'small', name: 'Small (10")', price: 0, description: 'Perfect for 1-2 people' },
      { id: 'medium', name: 'Medium (12")', price: 3.00, description: 'Great for 2-3 people' },
      { id: 'large', name: 'Large (14")', price: 6.00, description: 'Ideal for 3-4 people' },
      { id: 'xlarge', name: 'X-Large (16")', price: 9.00, description: 'Perfect for sharing' }
    ],
    spiceLevels: [
      { level: 0, name: 'No Spice', icon: '🌿' },
      { level: 1, name: 'Mild', icon: '🌶️' },
      { level: 2, name: 'Medium', icon: '🌶️🌶️' },
      { level: 3, name: 'Hot', icon: '🌶️🌶️🌶️' },
      { level: 4, name: 'Extra Hot', icon: '🔥🔥🔥' }
    ],
    ingredients: [
      { id: 'extra-cheese', name: 'Extra Cheese', price: 2.50, type: 'add' },
      { id: 'pepperoni', name: 'Pepperoni', price: 3.00, type: 'add' },
      { id: 'mushrooms', name: 'Mushrooms', price: 1.50, type: 'add' },
      { id: 'bell-peppers', name: 'Bell Peppers', price: 1.50, type: 'add' },
      { id: 'olives', name: 'Black Olives', price: 2.00, type: 'add' },
      { id: 'remove-cheese', name: 'No Cheese', price: -2.00, type: 'remove' },
      { id: 'remove-basil', name: 'No Basil', price: 0, type: 'remove' }
    ],
    allergens: ['Gluten', 'Dairy'],
    nutrition: {
      calories: 285,
      protein: '12g',
      carbs: '36g',
      fat: '10g',
      fiber: '2g',
      sodium: '640mg'
    },
    availability: true,
    category: 'Pizza'
  };

  const mockReviews = [
    {
      id: 1,
      customerName: 'Sarah Johnson',
      rating: 5,
      date: '2024-01-15',
      comment: 'Absolutely delicious! The crust was perfectly crispy and the ingredients tasted so fresh. Will definitely order again.',
      images: ['https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=150&fit=crop']
    },
    {
      id: 2,
      customerName: 'Mike Chen',
      rating: 4,
      date: '2024-01-12',
      comment: 'Great pizza, authentic taste. The delivery was quick too. Only wish the large size was a bit bigger for the price.',
      images: []
    },
    {
      id: 3,
      customerName: 'Emma Wilson',
      rating: 5,
      date: '2024-01-10',
      comment: 'Best Margherita pizza in town! The basil was so aromatic and the mozzarella was creamy. Highly recommended!',
      images: ['https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=150&fit=crop']
    }
  ];

  const mockRelatedItems = [
    {
      id: 'item-002',
      name: 'Pepperoni Pizza',
      price: 21.99,
      image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300&h=200&fit=crop',
      rating: 4.6
    },
    {
      id: 'item-003',
      name: 'Caesar Salad',
      price: 12.99,
      image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300&h=200&fit=crop',
      rating: 4.5
    },
    {
      id: 'item-004',
      name: 'Garlic Bread',
      price: 8.99,
      image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=300&h=200&fit=crop',
      rating: 4.8
    },
    {
      id: 'item-005',
      name: 'Tiramisu',
      price: 7.99,
      image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300&h=200&fit=crop',
      rating: 4.9
    }
  ];

  useEffect(() => {
    setSelectedItem(mockItem);
    // Initialize selected ingredients state
    const initialIngredients = {};
    mockItem.ingredients.forEach(ingredient => {
      initialIngredients[ingredient.id] = false;
    });
    setSelectedIngredients(initialIngredients);
  }, []);

  const calculateTotalPrice = () => {
    if (!selectedItem) return 0;
    
    let total = selectedItem.basePrice;
    
    // Add size price
    const selectedSizeData = selectedItem.sizes.find(size => size.id === selectedSize);
    if (selectedSizeData) {
      total += selectedSizeData.price;
    }
    
    // Add ingredient prices
    Object.keys(selectedIngredients).forEach(ingredientId => {
      if (selectedIngredients[ingredientId]) {
        const ingredient = selectedItem.ingredients.find(ing => ing.id === ingredientId);
        if (ingredient) {
          total += ingredient.price;
        }
      }
    });
    
    return total * quantity;
  };

  const handleIngredientToggle = (ingredientId) => {
    setSelectedIngredients(prev => ({
      ...prev,
      [ingredientId]: !prev[ingredientId]
    }));
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    const cartItem = {
      id: selectedItem.id,
      name: selectedItem.name,
      size: selectedSize,
      spiceLevel,
      ingredients: selectedIngredients,
      specialInstructions,
      quantity,
      totalPrice: calculateTotalPrice()
    };
    
    console.log('Adding to cart:', cartItem);
    setCartItemCount(prev => prev + quantity);
    
    // Show success message or navigate
    navigate('/shopping-cart-checkout');
  };

  const handleImageNavigation = (direction) => {
    if (!selectedItem) return;
    
    if (direction === 'prev') {
      setCurrentImageIndex(prev => 
        prev === 0 ? selectedItem.images.length - 1 : prev - 1
      );
    } else {
      setCurrentImageIndex(prev => 
        prev === selectedItem.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handleRelatedItemClick = (itemId) => {
    // In real app, this would fetch new item data
    console.log('Navigate to item:', itemId);
  };

  const handleClose = () => {
    navigate('/menu-browse-search');
  };

  if (!selectedItem) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader2" size={48} className="text-primary animate-spin mx-auto mb-4" />
          <p className="text-text-secondary font-body">Loading item details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <CustomerNavigation />
      
      {/* Mobile: Full Screen Layout */}
      <div className="lg:hidden pt-16">
        {/* Header */}
        <div className="sticky top-16 z-10 bg-surface shadow-soft px-4 py-3 flex items-center justify-between">
          <button
            onClick={handleClose}
            className="p-2 text-text-secondary hover:text-primary transition-smooth"
          >
            <Icon name="ArrowLeft" size={24} />
          </button>
          <h1 className="font-heading font-heading-medium text-text-primary truncate mx-4">
            {selectedItem.name}
          </h1>
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-2 text-text-secondary hover:text-primary transition-smooth"
          >
            <Icon name={isFavorite ? "Heart" : "Heart"} size={24} className={isFavorite ? "text-error fill-current" : ""} />
          </button>
        </div>

        {/* Image Carousel */}
        <div className="relative h-64 bg-secondary-100">
          <Image
            src={selectedItem.images[currentImageIndex]}
            alt={selectedItem.name}
            className="w-full h-full object-cover"
          />
          
          {selectedItem.images.length > 1 && (
            <>
              <button
                onClick={() => handleImageNavigation('prev')}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-surface bg-opacity-80 rounded-full flex items-center justify-center text-text-primary hover:bg-opacity-100 transition-smooth"
              >
                <Icon name="ChevronLeft" size={20} />
              </button>
              <button
                onClick={() => handleImageNavigation('next')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-surface bg-opacity-80 rounded-full flex items-center justify-center text-text-primary hover:bg-opacity-100 transition-smooth"
              >
                <Icon name="ChevronRight" size={20} />
              </button>
              
              {/* Image Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {selectedItem.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-smooth ${
                      index === currentImageIndex ? 'bg-surface' : 'bg-surface bg-opacity-50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Content */}
        <div className="px-4 pb-24">
          {/* Item Info */}
          <div className="py-6 border-b border-border">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h2 className="text-2xl font-heading font-heading-medium text-text-primary mb-2">
                  {selectedItem.name}
                </h2>
                <div className="flex items-center space-x-4 mb-3">
                  <div className="flex items-center space-x-1">
                    <Icon name="Star" size={16} className="text-warning fill-current" />
                    <span className="text-sm font-body font-body-medium text-text-primary">
                      {selectedItem.rating}
                    </span>
                    <span className="text-sm text-text-secondary font-body">
                      ({selectedItem.reviewCount} reviews)
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-text-secondary">
                    <Icon name="Clock" size={16} />
                    <span className="text-sm font-body">{selectedItem.prepTime}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-heading font-heading-medium text-primary">
                  ${calculateTotalPrice().toFixed(2)}
                </div>
                <div className="text-sm text-text-secondary font-body">
                  Base: ${selectedItem.basePrice.toFixed(2)}
                </div>
              </div>
            </div>
            
            <p className="text-text-secondary font-body leading-relaxed">
              {selectedItem.description}
            </p>
            
            {/* Allergen Info */}
            {selectedItem.allergens.length > 0 && (
              <div className="mt-4 p-3 bg-warning-50 border border-warning-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="AlertTriangle" size={16} className="text-warning" />
                  <span className="text-sm font-body font-body-medium text-warning-600">
                    Allergen Information
                  </span>
                </div>
                <p className="text-sm text-warning-600 font-body">
                  Contains: {selectedItem.allergens.join(', ')}
                </p>
              </div>
            )}
          </div>

          {/* Size Selection */}
          <div className="py-6 border-b border-border">
            <h3 className="text-lg font-heading font-heading-medium text-text-primary mb-4">
              Choose Size
            </h3>
            <div className="space-y-3">
              {selectedItem.sizes.map((size) => (
                <button
                  key={size.id}
                  onClick={() => setSelectedSize(size.id)}
                  className={`w-full p-4 rounded-lg border-2 transition-smooth text-left ${
                    selectedSize === size.id
                      ? 'border-primary bg-primary-50' :'border-border hover:border-primary-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-body font-body-medium text-text-primary">
                        {size.name}
                      </div>
                      <div className="text-sm text-text-secondary font-body">
                        {size.description}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-body font-body-medium text-text-primary">
                        {size.price > 0 ? `+$${size.price.toFixed(2)}` : 'Base'}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Spice Level */}
          <div className="py-6 border-b border-border">
            <h3 className="text-lg font-heading font-heading-medium text-text-primary mb-4">
              Spice Level
            </h3>
            <div className="space-y-3">
              {selectedItem.spiceLevels.map((level) => (
                <button
                  key={level.level}
                  onClick={() => setSpiceLevel(level.level)}
                  className={`w-full p-3 rounded-lg border transition-smooth text-left ${
                    spiceLevel === level.level
                      ? 'border-primary bg-primary-50' :'border-border hover:border-primary-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{level.icon}</span>
                    <span className="font-body font-body-medium text-text-primary">
                      {level.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Ingredients */}
          <div className="py-6 border-b border-border">
            <h3 className="text-lg font-heading font-heading-medium text-text-primary mb-4">
              Customize Ingredients
            </h3>
            <div className="space-y-3">
              {selectedItem.ingredients.map((ingredient) => (
                <div
                  key={ingredient.id}
                  className="flex items-center justify-between p-3 border border-border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleIngredientToggle(ingredient.id)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-smooth ${
                        selectedIngredients[ingredient.id]
                          ? 'border-primary bg-primary' :'border-border'
                      }`}
                    >
                      {selectedIngredients[ingredient.id] && (
                        <Icon name="Check" size={12} color="white" />
                      )}
                    </button>
                    <div>
                      <div className="font-body font-body-medium text-text-primary">
                        {ingredient.name}
                      </div>
                      <div className="text-sm text-text-secondary font-body">
                        {ingredient.type === 'add' ? 'Add' : 'Remove'}
                      </div>
                    </div>
                  </div>
                  <div className="font-body font-body-medium text-text-primary">
                    {ingredient.price > 0 ? `+$${ingredient.price.toFixed(2)}` : 
                     ingredient.price < 0 ? `-$${Math.abs(ingredient.price).toFixed(2)}` : 'Free'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Special Instructions */}
          <div className="py-6 border-b border-border">
            <h3 className="text-lg font-heading font-heading-medium text-text-primary mb-4">
              Special Instructions
            </h3>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Any special requests or dietary requirements..."
              className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth font-body resize-none"
              rows={3}
              maxLength={200}
            />
            <div className="text-right text-sm text-text-secondary font-body mt-1">
              {specialInstructions.length}/200
            </div>
          </div>

          {/* Nutrition Facts */}
          <div className="py-6 border-b border-border">
            <button
              onClick={() => setShowNutrition(!showNutrition)}
              className="w-full flex items-center justify-between p-3 hover:bg-secondary-50 rounded-lg transition-smooth"
            >
              <h3 className="text-lg font-heading font-heading-medium text-text-primary">
                Nutrition Facts
              </h3>
              <Icon name={showNutrition ? "ChevronUp" : "ChevronDown"} size={20} className="text-text-secondary" />
            </button>
            
            {showNutrition && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                {Object.entries(selectedItem.nutrition).map(([key, value]) => (
                  <div key={key} className="text-center p-3 bg-secondary-50 rounded-lg">
                    <div className="text-sm text-text-secondary font-body capitalize">
                      {key}
                    </div>
                    <div className="font-body font-body-medium text-text-primary">
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reviews */}
          <div className="py-6 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-heading font-heading-medium text-text-primary">
                Customer Reviews
              </h3>
              <button className="text-primary hover:text-primary-700 font-body font-body-medium transition-smooth">
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {mockReviews.slice(0, 2).map((review) => (
                <div key={review.id} className="p-4 bg-secondary-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-body font-body-medium text-text-primary">
                        {review.customerName}
                      </span>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Icon
                            key={i}
                            name="Star"
                            size={12}
                            className={i < review.rating ? "text-warning fill-current" : "text-secondary-300"}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-text-secondary font-body">
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-text-secondary font-body text-sm">
                    {review.comment}
                  </p>
                  {review.images.length > 0 && (
                    <div className="flex space-x-2 mt-3">
                      {review.images.map((image, index) => (
                        <Image
                          key={index}
                          src={image}
                          alt="Review"
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Related Items */}
          <div className="py-6">
            <h3 className="text-lg font-heading font-heading-medium text-text-primary mb-4">
              You Might Also Like
            </h3>
            <div className="flex space-x-4 overflow-x-auto pb-2">
              {mockRelatedItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleRelatedItemClick(item.id)}
                  className="flex-shrink-0 w-48 bg-surface rounded-lg shadow-soft hover:shadow-floating transition-smooth"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    className="w-full h-32 object-cover rounded-t-lg"
                  />
                  <div className="p-3">
                    <h4 className="font-body font-body-medium text-text-primary text-sm mb-1 truncate">
                      {item.name}
                    </h4>
                    <div className="flex items-center justify-between">
                      <span className="text-primary font-body font-body-medium">
                        ${item.price}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Icon name="Star" size={12} className="text-warning fill-current" />
                        <span className="text-xs text-text-secondary font-body">
                          {item.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Fixed Bottom Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border p-4 z-10">
          <div className="flex items-center space-x-4">
            {/* Quantity Selector */}
            <div className="flex items-center space-x-3 bg-secondary-50 rounded-lg p-2">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="w-8 h-8 flex items-center justify-center text-text-secondary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
              >
                <Icon name="Minus" size={16} />
              </button>
              <span className="font-data font-data-normal text-text-primary min-w-[2rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= 10}
                className="w-8 h-8 flex items-center justify-center text-text-secondary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
              >
                <Icon name="Plus" size={16} />
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={!selectedItem.availability}
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-smooth font-body font-body-medium"
            >
              <Icon name="ShoppingCart" size={20} />
              <span>Add to Cart • ${calculateTotalPrice().toFixed(2)}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop: Modal Layout */}
      <div className="hidden lg:block">
        <div className="fixed inset-0 z-modal flex items-center justify-center p-8 pt-24">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-secondary-900 bg-opacity-50 transition-modal"
            onClick={handleClose}
          ></div>

          {/* Modal */}
          <div className="relative bg-surface rounded-2xl shadow-floating max-w-6xl w-full max-h-[90vh] overflow-hidden transition-modal">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-2xl font-heading font-heading-medium text-text-primary">
                {selectedItem.name}
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="p-2 text-text-secondary hover:text-primary transition-smooth"
                >
                  <Icon name={isFavorite ? "Heart" : "Heart"} size={24} className={isFavorite ? "text-error fill-current" : ""} />
                </button>
                <button
                  onClick={handleClose}
                  className="p-2 text-text-secondary hover:text-primary transition-smooth"
                >
                  <Icon name="X" size={24} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex h-[calc(90vh-8rem)] overflow-hidden">
              {/* Left: Image Gallery */}
              <div className="w-1/2 relative bg-secondary-100">
                <Image
                  src={selectedItem.images[currentImageIndex]}
                  alt={selectedItem.name}
                  className="w-full h-full object-cover"
                />
                
                {selectedItem.images.length > 1 && (
                  <>
                    <button
                      onClick={() => handleImageNavigation('prev')}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-surface bg-opacity-80 rounded-full flex items-center justify-center text-text-primary hover:bg-opacity-100 transition-smooth"
                    >
                      <Icon name="ChevronLeft" size={24} />
                    </button>
                    <button
                      onClick={() => handleImageNavigation('next')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-surface bg-opacity-80 rounded-full flex items-center justify-center text-text-primary hover:bg-opacity-100 transition-smooth"
                    >
                      <Icon name="ChevronRight" size={24} />
                    </button>
                    
                    {/* Thumbnail Navigation */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {selectedItem.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-smooth ${
                            index === currentImageIndex ? 'border-primary' : 'border-surface border-opacity-50'
                          }`}
                        >
                          <Image
                            src={image}
                            alt={`${selectedItem.name} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Right: Details */}
              <div className="w-1/2 flex flex-col">
                <div className="flex-1 overflow-y-auto p-6">
                  {/* Item Info */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-4 mb-2">
                          <div className="flex items-center space-x-1">
                            <Icon name="Star" size={18} className="text-warning fill-current" />
                            <span className="font-body font-body-medium text-text-primary">
                              {selectedItem.rating}
                            </span>
                            <span className="text-text-secondary font-body">
                              ({selectedItem.reviewCount} reviews)
                            </span>
                          </div>
                          <div className="flex items-center space-x-1 text-text-secondary">
                            <Icon name="Clock" size={16} />
                            <span className="font-body">{selectedItem.prepTime}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-heading font-heading-medium text-primary">
                          ${calculateTotalPrice().toFixed(2)}
                        </div>
                        <div className="text-text-secondary font-body">
                          Base: ${selectedItem.basePrice.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-text-secondary font-body leading-relaxed mb-4">
                      {selectedItem.description}
                    </p>
                    
                    {/* Allergen Info */}
                    {selectedItem.allergens.length > 0 && (
                      <div className="p-4 bg-warning-50 border border-warning-200 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Icon name="AlertTriangle" size={18} className="text-warning" />
                          <span className="font-body font-body-medium text-warning-600">
                            Allergen Information
                          </span>
                        </div>
                        <p className="text-warning-600 font-body">
                          Contains: {selectedItem.allergens.join(', ')}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Customization Options */}
                  <div className="space-y-6">
                    {/* Size Selection */}
                    <div>
                      <h3 className="text-lg font-heading font-heading-medium text-text-primary mb-3">
                        Choose Size
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {selectedItem.sizes.map((size) => (
                          <button
                            key={size.id}
                            onClick={() => setSelectedSize(size.id)}
                            className={`p-3 rounded-lg border-2 transition-smooth text-left ${
                              selectedSize === size.id
                                ? 'border-primary bg-primary-50' :'border-border hover:border-primary-200'
                            }`}
                          >
                            <div className="font-body font-body-medium text-text-primary">
                              {size.name}
                            </div>
                            <div className="text-sm text-text-secondary font-body">
                              {size.price > 0 ? `+$${size.price.toFixed(2)}` : 'Base'}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Spice Level */}
                    <div>
                      <h3 className="text-lg font-heading font-heading-medium text-text-primary mb-3">
                        Spice Level
                      </h3>
                      <div className="flex space-x-2">
                        {selectedItem.spiceLevels.map((level) => (
                          <button
                            key={level.level}
                            onClick={() => setSpiceLevel(level.level)}
                            className={`flex-1 p-3 rounded-lg border transition-smooth ${
                              spiceLevel === level.level
                                ? 'border-primary bg-primary-50' :'border-border hover:border-primary-200'
                            }`}
                          >
                            <div className="text-center">
                              <div className="text-lg mb-1">{level.icon}</div>
                              <div className="text-sm font-body font-body-medium text-text-primary">
                                {level.name}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Ingredients */}
                    <div>
                      <h3 className="text-lg font-heading font-heading-medium text-text-primary mb-3">
                        Customize Ingredients
                      </h3>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {selectedItem.ingredients.map((ingredient) => (
                          <div
                            key={ingredient.id}
                            className="flex items-center justify-between p-3 border border-border rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => handleIngredientToggle(ingredient.id)}
                                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-smooth ${
                                  selectedIngredients[ingredient.id]
                                    ? 'border-primary bg-primary' :'border-border'
                                }`}
                              >
                                {selectedIngredients[ingredient.id] && (
                                  <Icon name="Check" size={12} color="white" />
                                )}
                              </button>
                              <span className="font-body font-body-medium text-text-primary">
                                {ingredient.name}
                              </span>
                            </div>
                            <span className="font-body font-body-medium text-text-primary">
                              {ingredient.price > 0 ? `+$${ingredient.price.toFixed(2)}` : 
                               ingredient.price < 0 ? `-$${Math.abs(ingredient.price).toFixed(2)}` : 'Free'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Special Instructions */}
                    <div>
                      <h3 className="text-lg font-heading font-heading-medium text-text-primary mb-3">
                        Special Instructions
                      </h3>
                      <textarea
                        value={specialInstructions}
                        onChange={(e) => setSpecialInstructions(e.target.value)}
                        placeholder="Any special requests or dietary requirements..."
                        className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth font-body resize-none"
                        rows={3}
                        maxLength={200}
                      />
                      <div className="text-right text-sm text-text-secondary font-body mt-1">
                        {specialInstructions.length}/200
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="border-t border-border p-6">
                  <div className="flex items-center space-x-4">
                    {/* Quantity Selector */}
                    <div className="flex items-center space-x-3 bg-secondary-50 rounded-lg p-2">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
                      >
                        <Icon name="Minus" size={18} />
                      </button>
                      <span className="font-data font-data-normal text-lg text-text-primary min-w-[3rem] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= 10}
                        className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
                      >
                        <Icon name="Plus" size={18} />
                      </button>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={handleAddToCart}
                      disabled={!selectedItem.availability}
                      className="flex-1 flex items-center justify-center space-x-2 px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-smooth font-body font-body-medium text-lg"
                    >
                      <Icon name="ShoppingCart" size={24} />
                      <span>Add to Cart • ${calculateTotalPrice().toFixed(2)}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemDetailCustomization;