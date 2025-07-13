require('dotenv').config();
const express = require('express');
const axios = require('axios');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;

// Check if API key is set
if (!SPOONACULAR_API_KEY || SPOONACULAR_API_KEY === 'your_api_key_here') {
  console.log('⚠️  SPOONACULAR_API_KEY not set in .env file');
  console.log('📝 Please get your free API key from: https://spoonacular.com/food-api');
  console.log('📝 You get 150 free requests per day');
  console.log('📝 Add it to .env file as: SPOONACULAR_API_KEY=your_actual_key');
}

// SQLite setup for favorites and history (keeping local data)
const db = new Database('./recipes.db');

// Initialize favorites and history tables
try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      recipe_id INTEGER NOT NULL,
      recipe_data TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      recipe_id INTEGER NOT NULL,
      recipe_data TEXT NOT NULL,
      mood_selected TEXT,
      viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
} catch (error) {
  console.log('Database tables already exist or error:', error.message);
}

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Mood to search mapping for Spoonacular
const moodToSearchParams = {
  happy: {
    tags: 'comfort food,dessert',
    type: 'main course,dessert',
    cuisine: 'french,italian'
  },
  sad: {
    tags: 'comfort food,warming,hearty',
    type: 'main course,soup',
    cuisine: 'french,american'
  },
  adventurous: {
    tags: 'exotic,spicy,unusual',
    type: 'main course,appetizer',
    cuisine: 'asian,indian,mexican,middle eastern'
  },
  relaxed: {
    tags: 'easy,quick,light,fresh',
    type: 'salad,soup,appetizer',
    cuisine: 'mediterranean,french'
  },
  energetic: {
    tags: 'healthy,fresh,protein,vitamins',
    type: 'salad,smoothie,main course',
    cuisine: 'mediterranean,healthy'
  },
  diet: {
    tags: 'healthy,nutritious',
    type: 'salad,main course,soup',
    cuisine: 'mediterranean'
  }
};

// Spoonacular API helper functions
async function searchRecipesByMood(mood, excludeIds = []) {
  if (!SPOONACULAR_API_KEY || SPOONACULAR_API_KEY === 'your_api_key_here') {
    // Fallback to demo data when no API key
    return getDemoRecipes(mood);
  }

  try {
    const searchParams = moodToSearchParams[mood] || moodToSearchParams.happy;
    
    const requestParams = {
      apiKey: SPOONACULAR_API_KEY,
      tags: searchParams.tags,
      type: searchParams.type,
      cuisine: searchParams.cuisine,
      number: 20,
      addRecipeInformation: true,
      fillIngredients: true,
      sort: 'popularity'
    };

    // Add diet-specific parameters
    if (searchParams.diet) requestParams.diet = searchParams.diet;
    if (searchParams.maxCalories) requestParams.maxCalories = searchParams.maxCalories;

    const response = await axios.get('https://api.spoonacular.com/recipes/complexSearch', {
      params: requestParams
    });

    const recipes = response.data.results;
    
    // Filter out excluded recipes
    const filteredRecipes = recipes.filter(recipe => !excludeIds.includes(recipe.id));
    
    return filteredRecipes.map(recipe => ({
      id: recipe.id,
      title: recipe.title,
      description: recipe.summary ? recipe.summary.replace(/<[^>]*>/g, '').substring(0, 200) + '...' : '',
      image_url: recipe.image,
      prep_time: recipe.preparationMinutes || 0,
      cook_time: recipe.cookingMinutes || 0,
      difficulty: getDifficultyFromTime(recipe.preparationMinutes + recipe.cookingMinutes),
      category: recipe.dishTypes ? recipe.dishTypes[0] : '',
      cuisine_type: recipe.cuisines ? recipe.cuisines[0] : '',
      ingredients: JSON.stringify(recipe.extendedIngredients ? 
        recipe.extendedIngredients.map(ing => ing.original) : []
      ),
      steps: JSON.stringify([]),
      mood: mood,
      is_favorite: isRecipeFavorite(recipe.id),
      times_viewed: 0,
      servings: recipe.servings || 4,
      source_url: recipe.sourceUrl
    }));
  } catch (error) {
    console.error('Spoonacular API error:', error.message);
    return getDemoRecipes(mood);
  }
}

async function getRecipeDetails(recipeId) {
  if (!SPOONACULAR_API_KEY || SPOONACULAR_API_KEY === 'your_api_key_here') {
    return getDemoRecipeDetails(recipeId);
  }

  try {
    const response = await axios.get(`https://api.spoonacular.com/recipes/${recipeId}/information`, {
      params: {
        apiKey: SPOONACULAR_API_KEY,
        includeNutrition: false
      }
    });

    const recipe = response.data;
    
    // Get cooking instructions
    let steps = [];
    if (recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0) {
      steps = recipe.analyzedInstructions[0].steps.map(step => step.step);
    }

    return {
      id: recipe.id,
      title: recipe.title,
      description: recipe.summary ? recipe.summary.replace(/<[^>]*>/g, '').substring(0, 300) + '...' : '',
      image_url: recipe.image,
      prep_time: recipe.preparationMinutes || 0,
      cook_time: recipe.cookingMinutes || 0,
      difficulty: getDifficultyFromTime(recipe.preparationMinutes + recipe.cookingMinutes),
      category: recipe.dishTypes ? recipe.dishTypes[0] : '',
      cuisine_type: recipe.cuisines ? recipe.cuisines[0] : '',
      ingredients: JSON.stringify(recipe.extendedIngredients ? 
        recipe.extendedIngredients.map(ing => ing.original) : []
      ),
      steps: JSON.stringify(steps),
      is_favorite: isRecipeFavorite(recipe.id),
      servings: recipe.servings || 4,
      source_url: recipe.sourceUrl
    };
  } catch (error) {
    console.error('Error fetching recipe details:', error.message);
    return getDemoRecipeDetails(recipeId);
  }
}

async function searchRecipes(query, filters = {}) {
  if (!SPOONACULAR_API_KEY || SPOONACULAR_API_KEY === 'your_api_key_here') {
    return getDemoSearchResults(query);
  }

  try {
    const params = {
      apiKey: SPOONACULAR_API_KEY,
      query: query || '',
      number: 30,
      addRecipeInformation: true,
      fillIngredients: true,
      sort: 'popularity'
    };

    // Add filters
    if (filters.cuisine) params.cuisine = filters.cuisine;
    if (filters.diet) params.diet = filters.diet;
    if (filters.type) params.type = filters.type;
    if (filters.maxReadyTime) params.maxReadyTime = parseInt(filters.maxReadyTime);
    if (filters.intolerances) params.intolerances = filters.intolerances;
    if (filters.includeIngredients) params.includeIngredients = filters.includeIngredients;
    if (filters.excludeIngredients) params.excludeIngredients = filters.excludeIngredients;

    console.log('Search params:', params); // Debug log

    const response = await axios.get('https://api.spoonacular.com/recipes/complexSearch', {
      params
    });

    const recipes = response.data.results.map(recipe => ({
      id: recipe.id,
      title: recipe.title,
      description: recipe.summary ? recipe.summary.replace(/<[^>]*>/g, '').substring(0, 200) + '...' : '',
      image_url: recipe.image,
      prep_time: recipe.preparationMinutes || 0,
      cook_time: recipe.cookingMinutes || 0,
      difficulty: getDifficultyFromTime((recipe.preparationMinutes || 0) + (recipe.cookingMinutes || 0)),
      category: recipe.dishTypes ? recipe.dishTypes[0] : '',
      cuisine_type: recipe.cuisines ? recipe.cuisines[0] : '',
      is_favorite: isRecipeFavorite(recipe.id),
      servings: recipe.servings || 4,
      readyInMinutes: recipe.readyInMinutes || 0,
      healthScore: recipe.healthScore || 0,
      spoonacularScore: recipe.spoonacularScore || 0
    }));

    console.log(`Found ${recipes.length} recipes`); // Debug log
    return recipes;
  } catch (error) {
    console.error('Search error:', error.message);
    return getDemoSearchResults(query);
  }
}

// Helper functions
function getDifficultyFromTime(totalTime) {
  if (totalTime <= 30) return 'easy';
  if (totalTime <= 60) return 'medium';
  return 'hard';
}

function isRecipeFavorite(recipeId) {
  try {
    const result = db.prepare('SELECT id FROM user_favorites WHERE recipe_id = ?').get(recipeId);
    return !!result;
  } catch (error) {
    return false;
  }
}

function trackRecipeView(recipeId, recipeData, mood) {
  try {
    db.prepare('INSERT INTO user_history (recipe_id, recipe_data, mood_selected) VALUES (?, ?, ?)')
      .run(recipeId, JSON.stringify(recipeData), mood);
  } catch (error) {
    console.error('Error tracking view:', error);
  }
}

// Demo data fallback functions
function getDemoRecipes(mood) {
  const demoRecipes = {
    happy: [
      {
        id: 1001,
        title: 'Chocolate Chip Cookies',
        description: 'Classic comfort cookies that bring joy to any day.',
        image_url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&h=600&fit=crop',
        prep_time: 15,
        cook_time: 12,
        difficulty: 'easy',
        category: 'dessert',
        cuisine_type: 'american',
        ingredients: JSON.stringify(['2 cups flour', '1 cup butter', '1/2 cup sugar', '1 cup chocolate chips']),
        steps: JSON.stringify(['Mix ingredients', 'Form cookies', 'Bake 12 minutes']),
        mood: mood,
        is_favorite: false,
        servings: 24
      }
    ],
    diet: [
      {
        id: 2001,
        title: 'Salade Méditerranéenne',
        description: 'Une salade fraîche et nutritive avec des ingrédients méditerranéens, parfaite pour ma princesse en forme.',
        image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&h=600&fit=crop',
        prep_time: 15,
        cook_time: 0,
        difficulty: 'easy',
        category: 'salad',
        cuisine_type: 'mediterranean',
        ingredients: JSON.stringify(['Tomates cerises', 'Concombre', 'Feta', 'Olives kalamata', 'Huile d\'olive', 'Citron', 'Herbes fraîches']),
        steps: JSON.stringify(['Couper les légumes en dés', 'Ajouter la feta émiettée', 'Assaisonner avec huile d\'olive et citron', 'Garnir d\'herbes fraîches']),
        mood: mood,
        is_favorite: false,
        servings: 2
      },
      {
        id: 2002,
        title: 'Bowl de Quinoa aux Légumes',
        description: 'Un bowl coloré et nutritif avec quinoa, légumes grillés et avocat pour ma consultante BCG préférée.',
        image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop',
        prep_time: 20,
        cook_time: 15,
        difficulty: 'easy',
        category: 'main course',
        cuisine_type: 'healthy',
        ingredients: JSON.stringify(['Quinoa', 'Courgettes', 'Poivrons', 'Avocat', 'Pousses d\'épinards', 'Graines de tournesol', 'Vinaigrette tahini']),
        steps: JSON.stringify(['Cuire le quinoa', 'Griller les légumes', 'Assembler le bowl avec épinards', 'Ajouter avocat et graines', 'Arroser de vinaigrette']),
        mood: mood,
        is_favorite: false,
        servings: 1
      }
    ]
  };
  
  return demoRecipes[mood] || demoRecipes.happy;
}

function getDemoRecipeDetails(recipeId) {
  return {
    id: recipeId,
    title: 'Demo Recipe',
    description: 'This is a demo recipe. Please add your Spoonacular API key to access real recipes.',
    image_url: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&h=600&fit=crop',
    prep_time: 15,
    cook_time: 30,
    difficulty: 'medium',
    category: 'main course',
    cuisine_type: 'international',
    ingredients: JSON.stringify(['Demo ingredient 1', 'Demo ingredient 2']),
    steps: JSON.stringify(['Demo step 1', 'Demo step 2']),
    is_favorite: false,
    servings: 4
  };
}

function getDemoSearchResults(query) {
  return [getDemoRecipeDetails(1001)];
}

// API Routes

// Get all moods
app.get('/moods', (req, res) => {
  res.json(['happy', 'sad', 'adventurous', 'relaxed', 'energetic', 'diet']);
});

// Get smart recipe recommendation for a mood
app.get('/recipe', async (req, res) => {
  const mood = req.query.mood;
  if (!mood) return res.status(400).json({ error: 'Mood is required' });
  
  try {
    // Get recent views to avoid repetition
    const recentViews = db.prepare(`
      SELECT recipe_id FROM user_history 
      WHERE viewed_at > datetime('now', '-1 day')
      ORDER BY viewed_at DESC LIMIT 10
    `).all();
    
    const excludeIds = recentViews.map(v => v.recipe_id);
    
    const recipes = await searchRecipesByMood(mood, excludeIds);
    if (!recipes.length) return res.status(404).json({ error: 'No recipes found for this mood' });
    
    // Get random recipe from results
    const recipe = recipes[Math.floor(Math.random() * recipes.length)];
    
    // Get full details
    const fullRecipe = await getRecipeDetails(recipe.id);
    
    // Track the view
    trackRecipeView(recipe.id, fullRecipe, mood);
    
    res.json(fullRecipe);
  } catch (err) {
    console.error('Recipe error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get available filter options based on Spoonacular API (MUST come before /:id route)
app.get('/api/recipes/categories', (req, res) => {
  const categories = [
    'main course', 'side dish', 'dessert', 'appetizer', 'salad', 'bread', 
    'breakfast', 'soup', 'beverage', 'sauce', 'marinade', 'fingerfood', 
    'snack', 'drink', 'antipasti', 'starter', 'lunch', 'dinner'
  ];
  res.json(categories.sort());
});

app.get('/api/recipes/difficulties', (req, res) => {
  res.json(['easy', 'medium', 'hard']);
});

app.get('/api/recipes/cuisines', (req, res) => {
  const cuisines = [
    'African', 'American', 'British', 'Cajun', 'Caribbean', 'Chinese', 
    'Eastern European', 'European', 'French', 'German', 'Greek', 'Indian', 
    'Irish', 'Italian', 'Japanese', 'Jewish', 'Korean', 'Latin American', 
    'Mediterranean', 'Mexican', 'Middle Eastern', 'Nordic', 'Southern', 
    'Spanish', 'Thai', 'Vietnamese'
  ];
  res.json(cuisines.sort());
});

app.get('/api/recipes/diets', (req, res) => {
  const diets = [
    'Gluten Free', 'Ketogenic', 'Vegetarian', 'Lacto-Vegetarian', 
    'Ovo-Vegetarian', 'Vegan', 'Pescetarian', 'Paleo', 'Primal', 
    'Low FODMAP', 'Whole30'
  ];
  res.json(diets.sort());
});

app.get('/api/recipes/intolerances', (req, res) => {
  const intolerances = [
    'Dairy', 'Egg', 'Gluten', 'Grain', 'Peanut', 'Seafood', 
    'Sesame', 'Shellfish', 'Soy', 'Sulfite', 'Tree Nut', 'Wheat'
  ];
  res.json(intolerances.sort());
});

// Search recipes
app.get('/api/recipes/search', async (req, res) => {
  try {
    const { 
      q, category, difficulty, maxTime, cuisine, diet, 
      intolerances, includeIngredients, excludeIngredients 
    } = req.query;
    
    const filters = {};
    if (cuisine) filters.cuisine = cuisine;
    if (category) filters.type = category;
    if (diet) filters.diet = diet;
    if (maxTime) filters.maxReadyTime = parseInt(maxTime);
    if (intolerances) filters.intolerances = intolerances;
    if (includeIngredients) filters.includeIngredients = includeIngredients;
    if (excludeIngredients) filters.excludeIngredients = excludeIngredients;
    
    let recipes = await searchRecipes(q || '', filters);
    
    // Apply difficulty filter after getting results (since Spoonacular doesn't have this filter)
    if (difficulty) {
      recipes = recipes.filter(recipe => recipe.difficulty === difficulty);
    }
    
    res.json(recipes);
  } catch (err) {
    console.error('Search endpoint error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get favorite recipes (MUST come before /:id route)
app.get('/api/recipes/favorites', async (req, res) => {
  try {
    const favorites = db.prepare('SELECT recipe_id FROM user_favorites ORDER BY created_at DESC').all();
    
    if (favorites.length === 0) {
      res.json([]);
      return;
    }
    
    const favoriteRecipes = [];
    for (const fav of favorites) {
      try {
        const recipe = await getRecipeDetails(fav.recipe_id);
        if (recipe && recipe.id !== null && recipe.id !== undefined) {
          favoriteRecipes.push(recipe);
        }
      } catch (error) {
        console.error(`Error fetching favorite recipe ${fav.recipe_id}:`, error.message);
      }
    }
    
    res.json(favoriteRecipes);
  } catch (err) {
    console.error('Favorites endpoint error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get recipe by ID (MUST come after specific routes)
app.get('/api/recipes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await getRecipeDetails(parseInt(id));
    
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Toggle favorite status
app.post('/api/recipes/:id/favorite', (req, res) => {
  try {
    const { id } = req.params;
    const recipeId = parseInt(id);
    
    const existing = db.prepare('SELECT id FROM user_favorites WHERE recipe_id = ?').get(recipeId);
    
    if (existing) {
      db.prepare('DELETE FROM user_favorites WHERE recipe_id = ?').run(recipeId);
      res.json({ success: true, is_favorite: false });
    } else {
      // We'll need recipe data - for now just store the ID
      db.prepare('INSERT INTO user_favorites (recipe_id, recipe_data) VALUES (?, ?)').run(recipeId, '{}');
      res.json({ success: true, is_favorite: true });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Get recipe history
app.get('/api/recipes/history', async (req, res) => {
  try {
    const history = db.prepare(`
      SELECT DISTINCT recipe_id, mood_selected, viewed_at
      FROM user_history 
      ORDER BY viewed_at DESC 
      LIMIT 20
    `).all();
    
    const historyRecipes = await Promise.all(
      history.map(async (item) => {
        try {
          const recipe = await getRecipeDetails(item.recipe_id);
          return {
            ...recipe,
            viewed_at: item.viewed_at,
            mood_selected: item.mood_selected
          };
        } catch (error) {
          return null;
        }
      })
    );
    
    res.json(historyRecipes.filter(recipe => recipe !== null));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  if (SPOONACULAR_API_KEY && SPOONACULAR_API_KEY !== 'your_api_key_here') {
    console.log('✅ Spoonacular API integration active!');
  } else {
    console.log('⚠️  Running in demo mode - add Spoonacular API key for full functionality');
  }
  console.log('🍽️  Recipe app ready for Candice!');
});