// Enhanced Recipe App for Candice
class RecipeApp {
  constructor() {
    this.currentMood = null;
    this.currentSection = 'mood';
    this.searchFilters = {};
    this.init();
  }

  async init() {
    await this.loadMoods();
    await this.loadFilterOptions();
    this.setupEventListeners();
    this.showSection('mood');
  }

  // Mood button configurations
  getMoodConfigs() {
    return {
      happy: { emoji: '😊', color: 'bg-yellow-200', bgColor: 'bg-yellow-200' },
      sad: { emoji: '😢', color: 'bg-blue-200', bgColor: 'bg-blue-200' },
      adventurous: { emoji: '🤠', color: 'bg-green-200', bgColor: 'bg-green-200' },
      relaxed: { emoji: '😌', color: 'bg-purple-200', bgColor: 'bg-purple-200' },
      energetic: { emoji: '⚡', color: 'bg-pink-200', bgColor: 'bg-pink-200' }
    };
  }

  // Get French display names for moods with Candice's personality
  getMoodDisplayName(mood) {
    const moodNames = {
      happy: 'Rayonnante ✨',
      sad: 'Câlins nécessaires 🤗', 
      adventurous: 'Prête pour l\'aventure 🏍️',
      relaxed: 'Mode plage activé 🏖️',
      energetic: 'Énergie BCG 💼⚡'
    };
    return moodNames[mood] || mood.charAt(0).toUpperCase() + mood.slice(1);
  }

  // Personal messages for Candice
  getPersonalMessage() {
    const messages = [
      "Ma princesse mérite le meilleur repas 👑",
      "Une recette digne de toi, ma belle 💕",
      "Inspiré par tes aventures à Paris 🏍️",
      "Parfait pour un pique-nique à la plage 🌊",
      "Cuisine de qualité BCG pour ma consultante préférée 📊",
      "Avec amour de ton chef personnel Suyash ❤️",
      "Une recette qui te fera sourire 😊",
      "Pour ma drôle de princesse française 🇫🇷",
      "Délicieux comme ton rire 🎵",
      "Un plat aussi beau que toi 🌹"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  // Tequila pairing suggestions for Candice
  getTequilaPairing(category) {
    const pairings = {
      'appetizer': '🍹 Parfait avec un Margarita classique',
      'main course': '🥃 Accompagne bien un Tequila Sunrise',
      'dessert': '🍸 Délicieux avec un cocktail à la mangue',
      'soup': '🍺 Idéal avec une bière Corona',
      'salad': '🍹 Sublime avec un Paloma frais',
      'snack': '🥂 Parfait pour l\'apéro tequila'
    };
    return pairings[category] || '🍹 Parfait pour accompagner tes cocktails préférés';
  }

  setupEventListeners() {
    // Navigation
    document.getElementById('nav-mood').onclick = () => this.showSection('mood');
    document.getElementById('nav-search').onclick = () => this.showSection('search');
    document.getElementById('nav-favorites').onclick = () => this.showSection('favorites');

    // Search
    const searchInput = document.getElementById('search-input');
    searchInput.oninput = this.debounce(() => this.performSearch(), 300);

    // Basic Filters
    document.getElementById('filter-category').onchange = () => this.performSearch();
    document.getElementById('filter-difficulty').onchange = () => this.performSearch();
    document.getElementById('filter-cuisine').onchange = () => this.performSearch();
    document.getElementById('filter-time').onchange = () => this.performSearch();
    document.getElementById('filter-diet').onchange = () => this.performSearch();
    document.getElementById('filter-intolerances').onchange = () => this.performSearch();

    // Advanced Filters
    document.getElementById('filter-include').oninput = this.debounce(() => this.performSearch(), 500);
    document.getElementById('filter-exclude').oninput = this.debounce(() => this.performSearch(), 500);

    // Advanced filters toggle
    document.getElementById('toggle-advanced').onclick = () => this.toggleAdvancedFilters();

    // Clear filters
    document.getElementById('clear-filters').onclick = () => this.clearAllFilters();
  }

  showSection(section) {
    // Update navigation
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`nav-${section}`).classList.add('active');

    // Hide all sections
    ['mood-section', 'search-section', 'favorites-section', 'recipe-card'].forEach(id => {
      const element = document.getElementById(id);
      if (element) element.classList.add('hidden');
    });

    // Show current section
    document.getElementById(`${section}-section`).classList.remove('hidden');
    this.currentSection = section;

    // Load section data
    if (section === 'favorites') {
      this.loadFavorites();
    } else if (section === 'search') {
      this.performSearch();
    }
  }

  async loadMoods() {
    try {
      const res = await fetch('/moods');
      const moods = await res.json();
      const selector = document.getElementById('mood-selector');
      selector.innerHTML = '';
      
      const moodConfigs = this.getMoodConfigs();
      
      moods.forEach(mood => {
        const config = moodConfigs[mood] || { emoji: '🍽️', color: 'from-gray-400 to-gray-600', bgColor: 'from-gray-400 to-gray-600' };
        
        const btn = document.createElement('button');
        btn.className = `mood-card ${config.bgColor} text-gray-700 p-6 rounded-xl font-medium shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`;
        btn.innerHTML = `
          <div class="text-3xl md:text-4xl mb-3">${config.emoji}</div>
          <div class="text-sm md:text-base font-semibold">${this.getMoodDisplayName(mood)}</div>
        `;
        btn.onclick = () => this.selectMood(mood);
        selector.appendChild(btn);
      });
    } catch (error) {
      console.error('Error loading moods:', error);
    }
  }

  async loadFilterOptions() {
    try {
      const [categories, difficulties, cuisines, diets, intolerances] = await Promise.all([
        fetch('/api/recipes/categories').then(r => r.json()),
        fetch('/api/recipes/difficulties').then(r => r.json()),
        fetch('/api/recipes/cuisines').then(r => r.json()),
        fetch('/api/recipes/diets').then(r => r.json()),
        fetch('/api/recipes/intolerances').then(r => r.json())
      ]);

      this.populateSelect('filter-category', categories, 'Tous types');
      this.populateSelect('filter-cuisine', cuisines, 'Toutes cuisines');
      this.populateSelect('filter-diet', diets, 'Aucun régime spécifique');
      this.populateSelect('filter-intolerances', intolerances, 'Aucune intolérance');
    } catch (error) {
      console.error('Error loading filter options:', error);
    }
  }

  populateSelect(selectId, options, defaultText) {
    const select = document.getElementById(selectId);
    select.innerHTML = `<option value="">${defaultText}</option>`;
    options.forEach(option => {
      const optionEl = document.createElement('option');
      optionEl.value = option;
      optionEl.textContent = option.charAt(0).toUpperCase() + option.slice(1);
      select.appendChild(optionEl);
    });
  }

  async selectMood(mood) {
    this.currentMood = mood;
    
    // Show loading state
    // Add loading state with Candice's personal touch
    const loadingMessages = [
      'Ton chef personnel cherche la recette parfaite... 👨‍🍳',
      'En route vers une nouvelle aventure culinaire... 🏍️',
      'Préparation d\'un délice digne de ma princesse... 👑',
      'Sélection de qualité BCG en cours... 📊✨',
      'Un moment, je choisis quelque chose de spécial... 💕'
    ];
    const loadingMessage = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
    
    const recipeCard = document.getElementById('recipe-card');
    recipeCard.innerHTML = `
      <div class="card-modern p-6 md:p-8 text-center">
        <div class="relative">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl">🏍️</div>
        </div>
        <p class="text-gray-600 text-base md:text-lg font-medium">${loadingMessage}</p>
      </div>
    `;
    recipeCard.classList.remove('hidden');
    
    // Scroll to recipe card on mobile
    setTimeout(() => {
      recipeCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
    
    await this.showRecipe(mood);
  }

  async showRecipe(mood) {
    try {
      const res = await fetch(`/recipe?mood=${encodeURIComponent(mood)}`);
      if (!res.ok) {
        document.getElementById('recipe-card').innerHTML = `
          <div class="card-modern p-6 md:p-8 text-center">
            <div class="text-4xl md:text-5xl mb-4">😔</div>
            <h2 class="text-xl md:text-2xl font-bold mb-3 text-gray-800">Aucune recette trouvée</h2>
            <p class="text-gray-600 text-base md:text-lg">Essaie une autre humeur !</p>
          </div>
        `;
        return;
      }
      
      const recipe = await res.json();
      this.displayFullRecipe(recipe);
      
    } catch (error) {
      console.error('Error fetching recipe:', error);
      document.getElementById('recipe-card').innerHTML = `
        <div class="card-modern p-6 md:p-8 text-center">
          <div class="text-4xl md:text-5xl mb-4">😔</div>
          <h2 class="text-xl md:text-2xl font-bold mb-3 text-gray-800">Erreur</h2>
          <p class="text-gray-600 text-base md:text-lg">Impossible de charger la recette</p>
        </div>
      `;
    }
  }

  displayFullRecipe(recipe) {
    const moodConfigs = this.getMoodConfigs();
    const moodConfig = moodConfigs[recipe.mood] || { emoji: '🍽️' };
    
    // Parse ingredients and steps
    let ingredients = [];
    let steps = [];
    
    try {
      ingredients = JSON.parse(recipe.ingredients || '[]');
      steps = JSON.parse(recipe.steps || '[]');
    } catch (e) {
      console.error('Error parsing recipe data:', e);
    }

    // If no steps, show a note about external recipe
    if (steps.length === 0 && recipe.source_url) {
      steps = [`Cette recette provient de ${recipe.source_url}. Cliquez sur le lien pour voir les instructions complètes.`];
    }

    // Build ingredients HTML
    let ingredientsHtml = '';
    if (ingredients.length > 0) {
      ingredientsHtml = `
        <div class="ingredients-list">
          <h3><i class="fas fa-shopping-basket mr-2"></i>Ingrédients</h3>
          <ul>
            ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
          </ul>
        </div>
      `;
    }

    // Build timing info
    let timingHtml = '';
    if (recipe.prep_time || recipe.cook_time) {
      const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);
      timingHtml = `
        <div class="time-info">
          <h3 class="font-semibold mb-3 flex items-center">
            <i class="fas fa-clock mr-2"></i>Temps de préparation
          </h3>
          ${recipe.prep_time ? `<div class="time-item"><span>Préparation:</span><span>${recipe.prep_time} min</span></div>` : ''}
          ${recipe.cook_time ? `<div class="time-item"><span>Cuisson:</span><span>${recipe.cook_time} min</span></div>` : ''}
          ${totalTime ? `<div class="time-item font-semibold border-t border-white/30 pt-2 mt-2"><span>Total:</span><span>${totalTime} min</span></div>` : ''}
        </div>
      `;
    }

    // Build steps HTML
    let stepsHtml = '';
    if (steps.length > 0) {
      stepsHtml = `
        <div class="bg-gray-50 rounded-xl p-6 mb-6">
          <h3 class="text-lg md:text-xl font-semibold text-gray-800 mb-4 text-center flex items-center justify-center">
            <i class="fas fa-list-ol mr-2"></i>Instructions
          </h3>
          <div class="space-y-4">
            ${steps.map((step, index) => `
              <div class="flex items-start space-x-4">
                <div class="step-number w-8 h-8 text-sm font-semibold flex-shrink-0">
                  ${index + 1}
                </div>
                <p class="text-gray-700 leading-relaxed text-base md:text-lg">${step}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // Get personal message and tequila pairing
    const personalMessage = this.getPersonalMessage();
    const tequilaPairing = this.getTequilaPairing(recipe.category);
    
    // Professional metrics for BCG style
    const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);
    const complexity = totalTime <= 30 ? 'Rapide' : totalTime <= 60 ? 'Standard' : 'Élaboré';
    const efficiency = recipe.servings ? Math.round(totalTime / recipe.servings) : 'N/A';

    document.getElementById('recipe-card').innerHTML = `
      <div class="recipe-card card-modern p-6 md:p-8">
        <div class="relative">
          ${recipe.image_url ? `
            <img src="${recipe.image_url}" alt="${recipe.title}" class="recipe-image rounded-xl mb-6">
            <button class="favorite-btn ${recipe.is_favorite ? 'active' : ''}" onclick="app.toggleFavorite(${recipe.id})">
              <i class="fas fa-heart"></i>
            </button>
          ` : ''}
        </div>
        
        <!-- Personal Message for Candice -->
        <div class="text-center mb-4 p-3 bg-purple-50 rounded-xl">
          <p class="princess-message text-sm md:text-base">${personalMessage}</p>
        </div>
        
        <!-- Professional Recipe Analytics for BCG Consultant -->
        <div class="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <div class="flex items-center justify-between mb-2">
            <h4 class="text-sm font-semibold text-gray-700 flex items-center">
              <i class="fas fa-analytics text-blue-600 mr-2"></i>
              Analyse Performance
            </h4>
            <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Consulting Quality</span>
          </div>
          <div class="grid grid-cols-3 gap-4 text-center">
            <div>
              <div class="text-lg font-bold text-blue-600">${complexity}</div>
              <div class="text-xs text-gray-500">Complexité</div>
            </div>
            <div>
              <div class="text-lg font-bold text-green-600">${efficiency !== 'N/A' ? efficiency + 'min' : 'N/A'}</div>
              <div class="text-xs text-gray-500">Efficacité/portion</div>
            </div>
            <div>
              <div class="text-lg font-bold text-purple-600">${recipe.servings || 'N/A'}</div>
              <div class="text-xs text-gray-500">Rendement</div>
            </div>
          </div>
        </div>
        
        <div class="text-center mb-6">
          <div class="flex items-center justify-center space-x-4 mb-4">
            <div class="text-4xl md:text-5xl">${moodConfig.emoji}</div>
            ${recipe.difficulty ? `<span class="difficulty-badge difficulty-${recipe.difficulty}">${recipe.difficulty}</span>` : ''}
            ${recipe.category ? `<span class="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">${recipe.category}</span>` : ''}
          </div>
          <h2 class="text-2xl md:text-3xl font-bold mb-3 text-gray-800">${recipe.title}</h2>
          <p class="text-gray-600 text-base md:text-lg leading-relaxed">${recipe.description}</p>
        </div>

        ${timingHtml}
        ${ingredientsHtml}
        ${stepsHtml}
        
        <!-- Cocktail Pairing for Candice -->
        <div class="text-center mb-6 p-3 bg-amber-50 rounded-xl">
          <p class="text-sm md:text-base font-medium text-amber-700">${tequilaPairing}</p>
        </div>
        
        <div class="text-center">
          <button onclick="app.showRecipe('${recipe.mood}')" class="btn-primary text-white px-8 py-4 rounded-xl font-semibold shadow-lg text-base md:text-lg mr-2 mb-2">
            🎲 Surprise-moi encore !
          </button>
          ${!recipe.is_favorite ? `
            <button onclick="app.toggleFavorite(${recipe.id})" class="bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg text-base md:text-lg mr-2 mb-2">
              <i class="fas fa-heart mr-2"></i>Mon trésor ⭐
            </button>
          ` : ''}
          ${recipe.source_url ? `
            <a href="${recipe.source_url}" target="_blank" class="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg text-base md:text-lg inline-block mb-2">
              <i class="fas fa-external-link-alt mr-2"></i>Détails complets 📖
            </a>
          ` : ''}
        </div>
      </div>
    `;
  }

  async performSearch() {
    const query = document.getElementById('search-input').value;
    const category = document.getElementById('filter-category').value;
    const difficulty = document.getElementById('filter-difficulty').value;
    const cuisine = document.getElementById('filter-cuisine').value;
    const maxTime = document.getElementById('filter-time').value;
    const diet = document.getElementById('filter-diet').value;
    const intolerances = document.getElementById('filter-intolerances').value;
    const includeIngredients = document.getElementById('filter-include').value;
    const excludeIngredients = document.getElementById('filter-exclude').value;

    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (category) params.append('category', category);
    if (difficulty) params.append('difficulty', difficulty);
    if (cuisine) params.append('cuisine', cuisine);
    if (maxTime) params.append('maxTime', maxTime);
    if (diet) params.append('diet', diet);
    if (intolerances) params.append('intolerances', intolerances);
    if (includeIngredients) params.append('includeIngredients', includeIngredients);
    if (excludeIngredients) params.append('excludeIngredients', excludeIngredients);

    try {
      // Show loading state with personal touch
      const searchMessages = [
        'Exploration des saveurs du monde... 🌍',
        'Recherche de délices pour ma princesse... 👑',
        'Consultation de la base de données culinaire... 📊',
        'Découverte de nouvelles aventures gustatives... 🏍️'
      ];
      const searchMessage = searchMessages[Math.floor(Math.random() * searchMessages.length)];
      
      document.getElementById('search-results').innerHTML = `
        <div class="col-span-full flex justify-center items-center py-12">
          <div class="text-center">
            <div class="relative">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl">🔍</div>
            </div>
            <p class="text-gray-600">${searchMessage}</p>
          </div>
        </div>
      `;

      const res = await fetch(`/api/recipes/search?${params}`);
      const recipes = await res.json();
      
      // Update search stats
      this.updateSearchStats(recipes.length, params);
      
      this.displayRecipeGrid(recipes, 'search-results');
    } catch (error) {
      console.error('Error searching recipes:', error);
      document.getElementById('search-results').innerHTML = `
        <div class="col-span-full text-center py-12">
          <div class="text-4xl mb-4">😔</div>
          <p class="text-gray-600 text-lg">Erreur lors de la recherche</p>
        </div>
      `;
    }
  }

  toggleAdvancedFilters() {
    const advancedFilters = document.getElementById('advanced-filters');
    const icon = document.getElementById('advanced-icon');
    
    if (advancedFilters.classList.contains('hidden')) {
      advancedFilters.classList.remove('hidden');
      icon.style.transform = 'rotate(180deg)';
    } else {
      advancedFilters.classList.add('hidden');
      icon.style.transform = 'rotate(0deg)';
    }
  }

  clearAllFilters() {
    document.getElementById('search-input').value = '';
    document.getElementById('filter-category').value = '';
    document.getElementById('filter-difficulty').value = '';
    document.getElementById('filter-cuisine').value = '';
    document.getElementById('filter-time').value = '';
    document.getElementById('filter-diet').value = '';
    document.getElementById('filter-intolerances').value = '';
    document.getElementById('filter-include').value = '';
    document.getElementById('filter-exclude').value = '';
    
    this.performSearch();
  }

  updateSearchStats(count, params) {
    const statsEl = document.getElementById('search-stats');
    let activeFilters = 0;
    
    for (const [key, value] of params) {
      if (value && key !== 'q') activeFilters++;
    }
    
    // BCG-style professional data presentation for Candice
    const efficiency = count > 20 ? 'Excellent' : count > 10 ? 'Bon' : count > 5 ? 'Modéré' : 'Ciblé';
    const efficiencyColor = count > 20 ? 'text-green-500' : count > 10 ? 'text-blue-500' : count > 5 ? 'text-amber-500' : 'text-purple-500';
    
    statsEl.innerHTML = `
      <div class="flex items-center space-x-4 text-xs">
        <div class="flex items-center">
          <span class="font-semibold">${count}</span>
          <span class="ml-1 text-gray-500">résultat${count !== 1 ? 's' : ''}</span>
        </div>
        ${activeFilters > 0 ? `
          <div class="flex items-center">
            <i class="fas fa-filter text-purple-400 mr-1"></i>
            <span class="font-medium">${activeFilters} filtre${activeFilters !== 1 ? 's' : ''}</span>
          </div>
        ` : ''}
        <div class="flex items-center">
          <span class="text-gray-500">Précision:</span>
          <span class="ml-1 font-semibold ${efficiencyColor}">${efficiency}</span>
          <span class="ml-1">📊</span>
        </div>
      </div>
    `;
  }

  async loadFavorites() {
    try {
      const res = await fetch('/api/recipes/favorites');
      const favorites = await res.json();
      this.displayRecipeGrid(favorites, 'favorites-list');
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }


  displayRecipeGrid(recipes, containerId) {
    const container = document.getElementById(containerId);
    
    if (recipes.length === 0) {
      container.innerHTML = `
        <div class="col-span-full text-center py-12">
          <div class="text-4xl mb-4">🍽️</div>
          <p class="text-gray-600 text-lg">Aucune recette trouvée</p>
        </div>
      `;
      return;
    }

    container.innerHTML = recipes.map(recipe => {
      const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);
      const tequilaPairing = this.getTequilaPairing(recipe.category);
      return `
        <div class="recipe-grid-card" onclick="app.showRecipeDetail(${recipe.id})">
          <div class="relative">
            ${recipe.image_url ? `
              <img src="${recipe.image_url}" alt="${recipe.title}" class="recipe-image">
              <button class="favorite-btn ${recipe.is_favorite ? 'active' : ''}" onclick="event.stopPropagation(); app.toggleFavorite(${recipe.id})">
                <i class="fas fa-heart"></i>
              </button>
            ` : ''}
          </div>
          
          <div class="p-4">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-bold text-lg text-gray-800 truncate">${recipe.title}</h3>
              ${recipe.difficulty ? `<span class="difficulty-badge difficulty-${recipe.difficulty}">${recipe.difficulty}</span>` : ''}
            </div>
            
            <p class="text-gray-600 text-sm mb-3 line-clamp-2">${recipe.description}</p>
            
            <!-- Cocktail pairing for Candice -->
            <div class="text-center mb-2 p-2 bg-yellow-50 rounded-lg">
              <p class="text-xs text-yellow-700 font-medium">${tequilaPairing}</p>
            </div>
            
            <div class="flex items-center justify-between text-sm text-gray-500">
              ${totalTime ? `<span><i class="fas fa-clock mr-1"></i>${totalTime} min</span>` : '<span></span>'}
              ${recipe.category ? `<span class="bg-gray-100 px-2 py-1 rounded text-xs">${recipe.category}</span>` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  async showRecipeDetail(recipeId) {
    try {
      const res = await fetch(`/api/recipes/${recipeId}`);
      const recipe = await res.json();
      
      this.displayFullRecipe(recipe);
      document.getElementById('recipe-card').classList.remove('hidden');
      document.getElementById('recipe-card').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error('Error loading recipe detail:', error);
    }
  }

  async toggleFavorite(recipeId) {
    try {
      const res = await fetch(`/api/recipes/${recipeId}/favorite`, { method: 'POST' });
      const result = await res.json();
      
      if (result.success) {
        // Update favorite buttons
        document.querySelectorAll(`.favorite-btn`).forEach(btn => {
          if (btn.onclick && btn.onclick.toString().includes(`toggleFavorite(${recipeId})`)) {
            if (result.is_favorite) {
              btn.classList.add('active');
            } else {
              btn.classList.remove('active');
            }
          }
        });

        // Refresh current section if needed
        if (this.currentSection === 'favorites') {
          this.loadFavorites();
        }

        // Show feedback with personalized messages
        const favoriteMessages = [
          'Ajouté à tes trésors culinaires 💎',
          'Une nouvelle pépite pour ma princesse ⭐',
          'Enregistré avec amour 💕',
          'Un favori digne de toi 👑'
        ];
        const unfavoriteMessages = [
          'Retiré de tes favoris 📝',
          'Plus dans tes trésors 💫',
          'Supprimé avec délicatesse 🌸'
        ];
        
        const message = result.is_favorite 
          ? favoriteMessages[Math.floor(Math.random() * favoriteMessages.length)]
          : unfavoriteMessages[Math.floor(Math.random() * unfavoriteMessages.length)];
          
        this.showToast(message);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      this.showToast('Erreur lors de la mise à jour');
    }
  }

  showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.remove('translate-x-full'), 100);
    setTimeout(() => {
      toast.classList.add('translate-x-full');
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// Initialize the app
const app = new RecipeApp();