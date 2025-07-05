// Mood button configurations with colors and emojis
const moodConfigs = {
  happy: { emoji: '😊', color: 'from-yellow-400 to-orange-400', bgColor: 'from-yellow-400 to-orange-400' },
  sad: { emoji: '😢', color: 'from-blue-400 to-indigo-500', bgColor: 'from-blue-400 to-indigo-500' },
  adventurous: { emoji: '🤠', color: 'from-green-400 to-teal-500', bgColor: 'from-green-400 to-teal-500' },
  relaxed: { emoji: '😌', color: 'from-purple-400 to-pink-400', bgColor: 'from-purple-400 to-pink-400' },
  energetic: { emoji: '⚡', color: 'from-red-400 to-pink-500', bgColor: 'from-red-400 to-pink-500' }
};

// Fetch moods and populate mood selector
async function loadMoods() {
  try {
    const res = await fetch('/moods');
    const moods = await res.json();
    const selector = document.getElementById('mood-selector');
    selector.innerHTML = '';
    
    moods.forEach(mood => {
      const config = moodConfigs[mood] || { emoji: '🍽️', color: 'from-gray-400 to-gray-600', bgColor: 'from-gray-400 to-gray-600' };
      
      const btn = document.createElement('button');
      btn.className = `mood-card bg-gradient-to-r ${config.bgColor} text-white p-6 rounded-xl font-medium shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`;
      btn.innerHTML = `
        <div class="text-3xl md:text-4xl mb-3">${config.emoji}</div>
        <div class="text-sm md:text-base font-semibold">${mood.charAt(0).toUpperCase() + mood.slice(1)}</div>
      `;
      btn.onclick = () => selectMood(mood);
      selector.appendChild(btn);
    });
  } catch (error) {
    console.error('Error loading moods:', error);
  }
}

let currentMood = null;

async function selectMood(mood) {
  currentMood = mood;
  
  // Add loading state
  const recipeCard = document.getElementById('recipe-card');
  recipeCard.innerHTML = `
    <div class="card-modern p-6 md:p-8 text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
      <p class="text-gray-600 text-base md:text-lg font-medium">Chargement de ta recette...</p>
    </div>
  `;
  recipeCard.classList.remove('hidden');
  
  // Scroll to recipe card on mobile
  setTimeout(() => {
    recipeCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 100);
  
  await showRecipe(mood);
}

async function showRecipe(mood) {
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
    
    // Remove old steps if present
    const oldSteps = document.getElementById('recipe-steps');
    if (oldSteps) oldSteps.remove();
    
    // Add steps as a styled list
    let stepsHtml = '';
    try {
      const steps = JSON.parse(recipe.steps);
      if (Array.isArray(steps) && steps.length) {
        stepsHtml = `
          <div class="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 class="text-lg md:text-xl font-semibold text-gray-800 mb-4 text-center">Instructions</h3>
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
    } catch (e) {
      console.error('Error parsing steps:', e);
    }
    
    document.getElementById('recipe-card').innerHTML = `
      <div class="recipe-card card-modern p-6 md:p-8">
        <div class="text-center mb-6">
          <div id="recipe-emoji" class="text-4xl md:text-5xl mb-4">${moodConfigs[mood]?.emoji || '🍽️'}</div>
          <h2 id="recipe-title" class="text-2xl md:text-3xl font-bold mb-3 text-gray-800">${recipe.title}</h2>
          <p id="recipe-desc" class="text-gray-600 text-base md:text-lg leading-relaxed">${recipe.description}</p>
        </div>
        ${stepsHtml}
        <div class="text-center">
          <button id="new-recipe" class="btn-primary text-white px-8 py-4 rounded-xl font-semibold shadow-lg text-base md:text-lg">
            Montre-moi une autre recette ✨
          </button>
        </div>
      </div>
    `;
    
    // Reattach event listener
    document.getElementById('new-recipe').onclick = () => {
      if (currentMood) showRecipe(currentMood);
    };
    
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

// Initialize the app
loadMoods(); 