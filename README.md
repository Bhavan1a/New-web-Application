# 🍽️ Recipe Ideas - Complete Refactored Code

A modern React recipe discovery application with meal search, categories, and favorite management using localStorage.

## 📁 Project Structure

```
recipe-ideas/
├── src/
│   ├── api/
│   │   └── mealApi.js                 # API calls to TheMealDB
│   │
│   ├── components/
│   │   ├── Navbar.jsx                 # Navigation header
│   │   ├── Loader.jsx                 # Loading spinner
│   │   ├── SearchBar.jsx              # Search input component
│   │   ├── RecipeCard.jsx             # Meal card display
│   │   ├── RecipeDetails.jsx          # Full recipe view
│   │   └── FavoritesList.jsx          # Favorites grid
│   │
│   ├── pages/
│   │   ├── Home.jsx                   # Main home page
│   │   ├── Favorites.jsx              # Favorites page
│   │   ├── RecipeDetailsPage.jsx      # Recipe detail page
│   │   └── NotFound.jsx               # 404 page
│   │
│   ├── hooks/
│   │   └── useDebounce.js             # Debounce hook
│   │
│   ├── utils/
│   │   ├── formatUtils.js             # Data formatting utilities
│   │   └── localStorageUtils.js       # localStorage management
│   │
│   ├── styles/
│   │   ├── App.css                    # Global styles
│   │   └── Home.css                   # Home page styles
│   │
│   ├── App.jsx                        # Main app component with routing
│   └── index.js                       # Entry point
│
└── package.json                       # Dependencies & scripts
```

## 🚀 Features

### Core Features
- **Search Recipes** by ingredient or meal name
- **View Details** - Full recipe with ingredients, instructions, video
- **Save Favorites** - Add/remove recipes with localStorage
- **Recent Searches** - Quick access to recent searches (last 5)
- **Responsive Design** - Mobile-friendly UI
- **Smooth Animations** - Framer Motion animations throughout

### User Experience
- Dark/light gradient background
- Real-time search with debouncing (600ms)
- Copy ingredients to clipboard
- External recipe links and YouTube videos
- Empty states with helpful messages
- Loading indicators
- Error handling

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm build
```

## 🔑 Key Files Breakdown

### API Integration (`api/mealApi.js`)
- `fetchMealsByIngredient()` - Search by ingredient
- `fetchMealByName()` - Search by recipe name
- `fetchRandomMeal()` - Get random recipe
- `fetchCategories()` - Get all categories
- `fetchMealsByCategory()` - Get meals in category
- `lookupMealById()` - Get single meal details

### Components

**Navbar.jsx** - Navigation with React Router
- Home and Favorites links
- Responsive mobile toggle

**SearchBar.jsx** - Smart search input
- Debounced search
- Quick search suggestions
- Type toggle (ingredient/name)

**RecipeCard.jsx** - Meal card display
- Image with hover effects
- Favorite button
- Category badge
- Quick actions

**RecipeDetails.jsx** - Full recipe display
- Large recipe image
- All ingredients with copy functionality
- Instructions section
- Video tutorial links
- Related tags

**FavoritesList.jsx** - Grid of favorites
- All saved recipes
- Remove functionality
- Empty state

### Pages

**Home.jsx** - Main page with tabs
- Ingredient/name search
- Category browsing
- Recent searches
- Random meal suggestions
- Favorites management

**Favorites.jsx** - Dedicated favorites page
- All saved recipes
- Clear all option
- Organized display

**RecipeDetailsPage.jsx** - Single recipe view
- Full recipe data
- Recent tracking
- Back navigation

### Utilities

**localStorageUtils.js** - Data persistence
- `addFavorite()` - Save recipe
- `removeFavorite()` - Delete recipe
- `getFavorites()` - Get all favorites
- `isFavorite()` - Check if saved
- `pushRecent()` - Track recent view
- `getRecent()` - Get recent list

**formatUtils.js** - Data formatting
- `extractIngredients()` - Parse ingredient list
- `formatMealData()` - Standardize meal data
- `truncateText()` - Limit text length

## 💾 LocalStorage Structure

```javascript
// Favorites (key: recipe_ideas_favorites_v1)
[
  {
    idMeal: "52772",
    strMeal: "Teriyaki Chicken Casserole",
    strMealThumb: "...",
    strArea: "Japanese",
    strCategory: "Seafood"
  }
]


```

## 🎨 Styling

- **Bootstrap 5** - Grid and components
- **Framer Motion** - Smooth animations
- **Custom CSS** - Gradients and effects
- **Responsive** - Mobile-first design

### Color Scheme
- Primary: `#667eea` - `#764ba2`
- Danger: `#ff6b6b`
- Backgrounds: Gradient blues
- Text: Dark grays `#333`

## 🔄 Data Flow

```
User Search
    ↓
SearchBar debounce (600ms)
    ↓
mealApi.js fetch
    ↓
formatUtils parse
    ↓
RecipeCard display
    ↓
favorite click
    ↓
localStorageUtils save
    ↓
localStorage update
```

## ⚡ Performance Optimizations

- Debounced search (reduces API calls)
- Lazy image loading
- Memoized components (potential)
- Efficient state management
- CSS animations over JS

## 🌐 API Reference

Uses **TheMealDB API** (free, no auth required)
- Base URL: `https://www.themealdb.com/api/json/v1/1`
- Endpoints: filters, search, lookup, random, categories

## 📱 Responsive Breakpoints

- **Mobile**: < 480px
- **Tablet**: 480px - 768px
- **Desktop**: > 768px

## 🎯 Future Enhancements

- Search history with timestamps
- Meal recommendations
- Dietary filters (vegan, gluten-free)
- Recipe sharing functionality
- User ratings/reviews
- Meal planning calendar
- Shopping list generator
- Dark mode toggle
- Multi-language support

## 🛠️ Development

```bash
# Start dev server
npm run dev

# Run tests
npm test

# Build production
npm build

# Production build
npm build && serve -s build
```

## 📝 Notes

- All data stored in browser localStorage
- No backend required
- Public API (no authentication)
- ~15 second API response time
- Clear recent when localStorage full

## 🤝 Contributing

Feel free to extend this project with:
- Additional filters
- Better error handling
- Analytics tracking
- PWA features
- Backend integration

## 📄 License

MIT License - Feel free to use this project

---

**Made with ❤️ | Powered by TheMealDB**