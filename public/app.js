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
      btn.className = `mood-btn bg-gradient-to-r ${config.bgColor} text-white px-3 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`;
      btn.innerHTML = `
        <div class="text-2xl md:text-3xl mb-1 md:mb-2">${config.emoji}</div>
        <div class="text-xs md:text-sm font-semibold">${mood.charAt(0).toUpperCase() + mood.slice(1)}</div>
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
    <div class="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100 text-center">
      <div class="animate-spin rounded-full h-8 md:h-12 w-8 md:w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
      <p class="text-gray-600 text-sm md:text-base">Chargement de ta recette...</p>
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
        <div class="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100 text-center">
          <div class="text-3xl md:text-4xl mb-4">😔</div>
          <h2 class="text-lg md:text-xl font-bold mb-2 text-gray-800">Aucune recette trouvée</h2>
          <p class="text-gray-600 text-sm md:text-base">Essaie une autre humeur !</p>
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
          <div class="bg-gray-50 rounded-xl p-3 md:p-4 mb-4 md:mb-6">
            <h3 class="text-base md:text-lg font-semibold text-gray-800 mb-3 text-center">Instructions</h3>
            <ol class="space-y-2 md:space-y-3">
              ${steps.map((step, index) => `
                <li class="flex items-start space-x-2 md:space-x-3">
                  <span class="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 bg-gradient-to-r from-pink-400 to-purple-500 text-white text-xs md:text-sm font-bold rounded-full flex items-center justify-center">
                    ${index + 1}
                  </span>
                  <span class="text-gray-700 leading-relaxed text-sm md:text-base">${step}</span>
                </li>
              `).join('')}
            </ol>
          </div>
        `;
      }
    } catch (e) {
      console.error('Error parsing steps:', e);
    }
    
    document.getElementById('recipe-card').innerHTML = `
      <div class="recipe-card bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100">
        <div class="text-center mb-4">
          <div class="text-3xl md:text-4xl mb-3">${moodConfigs[mood]?.emoji || '🍽️'}</div>
          <h2 class="text-lg md:text-2xl font-bold mb-3 text-gray-800">${recipe.title}</h2>
          <p class="text-gray-600 italic text-sm md:text-base">${recipe.description}</p>
        </div>
        ${stepsHtml}
        <div class="text-center">
          <button id="new-recipe" class="mood-btn text-white px-6 md:px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 text-sm md:text-base">
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
      <div class="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100 text-center">
        <div class="text-3xl md:text-4xl mb-4">😔</div>
        <h2 class="text-lg md:text-xl font-bold mb-2 text-gray-800">Erreur</h2>
        <p class="text-gray-600 text-sm md:text-base">Impossible de charger la recette</p>
      </div>
    `;
  }
}

// Initialize the app
loadMoods(); 