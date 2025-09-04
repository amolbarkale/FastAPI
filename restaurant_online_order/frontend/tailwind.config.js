/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'primary': '#E67E22', // Warm orange (primary) - orange-600
        'primary-50': '#FDF2E9', // Very light orange (50-level shade) - orange-50
        'primary-100': '#FCE4CA', // Light orange (100-level shade) - orange-100
        'primary-200': '#F8C471', // Medium light orange (200-level shade) - orange-200
        'primary-500': '#F39C12', // Medium orange (500-level shade) - orange-500
        'primary-600': '#E67E22', // Base orange (600-level shade) - orange-600
        'primary-700': '#D35400', // Dark orange (700-level shade) - orange-700
        'primary-800': '#A04000', // Darker orange (800-level shade) - orange-800
        'primary-900': '#7D2D00', // Darkest orange (900-level shade) - orange-900

        // Secondary Colors
        'secondary': '#2C3E50', // Deep blue-gray (secondary) - slate-800
        'secondary-50': '#F8FAFC', // Very light blue-gray (50-level shade) - slate-50
        'secondary-100': '#F1F5F9', // Light blue-gray (100-level shade) - slate-100
        'secondary-200': '#E2E8F0', // Medium light blue-gray (200-level shade) - slate-200
        'secondary-300': '#CBD5E1', // Medium blue-gray (300-level shade) - slate-300
        'secondary-400': '#94A3B8', // Medium blue-gray (400-level shade) - slate-400
        'secondary-500': '#64748B', // Medium blue-gray (500-level shade) - slate-500
        'secondary-600': '#475569', // Medium dark blue-gray (600-level shade) - slate-600
        'secondary-700': '#334155', // Dark blue-gray (700-level shade) - slate-700
        'secondary-800': '#2C3E50', // Base blue-gray (800-level shade) - slate-800
        'secondary-900': '#1E293B', // Darkest blue-gray (900-level shade) - slate-900

        // Accent Colors
        'accent': '#F39C12', // Vibrant amber (accent) - amber-500
        'accent-50': '#FFFBEB', // Very light amber (50-level shade) - amber-50
        'accent-100': '#FEF3C7', // Light amber (100-level shade) - amber-100
        'accent-200': '#FDE68A', // Medium light amber (200-level shade) - amber-200
        'accent-300': '#FCD34D', // Medium amber (300-level shade) - amber-300
        'accent-400': '#FBBF24', // Medium amber (400-level shade) - amber-400
        'accent-500': '#F39C12', // Base amber (500-level shade) - amber-500
        'accent-600': '#D97706', // Dark amber (600-level shade) - amber-600
        'accent-700': '#B45309', // Darker amber (700-level shade) - amber-700
        'accent-800': '#92400E', // Darkest amber (800-level shade) - amber-800

        // Background Colors
        'background': '#FAFAFA', // Soft off-white (background) - gray-50
        'surface': '#FFFFFF', // Pure white (surface) - white

        // Text Colors
        'text-primary': '#2C3E50', // High contrast dark text (text-primary) - slate-800
        'text-secondary': '#7F8C8D', // Medium gray supporting text (text-secondary) - gray-500

        // Status Colors
        'success': '#27AE60', // Fresh green (success) - green-600
        'success-50': '#F0FDF4', // Very light green (50-level shade) - green-50
        'success-100': '#DCFCE7', // Light green (100-level shade) - green-100
        'success-500': '#22C55E', // Medium green (500-level shade) - green-500
        'success-600': '#27AE60', // Base green (600-level shade) - green-600
        'success-700': '#15803D', // Dark green (700-level shade) - green-700

        'warning': '#F1C40F', // Clear yellow (warning) - yellow-400
        'warning-50': '#FEFCE8', // Very light yellow (50-level shade) - yellow-50
        'warning-100': '#FEF9C3', // Light yellow (100-level shade) - yellow-100
        'warning-400': '#F1C40F', // Base yellow (400-level shade) - yellow-400
        'warning-500': '#EAB308', // Medium yellow (500-level shade) - yellow-500
        'warning-600': '#CA8A04', // Dark yellow (600-level shade) - yellow-600

        'error': '#E74C3C', // Distinct red (error) - red-500
        'error-50': '#FEF2F2', // Very light red (50-level shade) - red-50
        'error-100': '#FEE2E2', // Light red (100-level shade) - red-100
        'error-500': '#E74C3C', // Base red (500-level shade) - red-500
        'error-600': '#DC2626', // Dark red (600-level shade) - red-600
        'error-700': '#B91C1C', // Darker red (700-level shade) - red-700

        // Border Colors
        'border': '#E5E5E5', // Light gray border (border) - gray-200
        'border-light': '#F3F4F6', // Very light gray border (border-light) - gray-100
      },
      fontFamily: {
        'heading': ['Inter', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
        'caption': ['Inter', 'sans-serif'],
        'data': ['JetBrains Mono', 'monospace'],
      },
      fontWeight: {
        'heading-normal': '400',
        'heading-medium': '600',
        'heading-bold': '700',
        'body-normal': '400',
        'body-medium': '500',
        'caption-normal': '400',
        'data-normal': '400',
      },
      boxShadow: {
        'soft': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'floating': '0 4px 12px rgba(0, 0, 0, 0.15)',
      },
      transitionDuration: {
        'smooth': '200ms',
        'modal': '300ms',
      },
      transitionTimingFunction: {
        'smooth': 'ease-out',
        'modal': 'ease-in-out',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      minHeight: {
        'touch': '44px',
      },
      minWidth: {
        'touch': '44px',
      },
      zIndex: {
        'navigation': '1000',
        'dropdown': '1100',
        'modal': '1200',
        'alert': '1300',
      },
    },
  },
  plugins: [],
}