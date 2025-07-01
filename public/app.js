// Fetch moods and populate mood selector
async function loadMoods() {
  const res = await fetch('/moods');
  const moods = await res.json();
  const selector = document.getElementById('mood-selector');
  selector.innerHTML = '';
  moods.forEach(mood => {
    const btn = document.createElement('button');
    btn.textContent = mood.charAt(0).toUpperCase() + mood.slice(1);
    btn.className = 'bg-green-400 text-white px-3 py-1 rounded hover:bg-green-500';
    btn.onclick = () => selectMood(mood);
    selector.appendChild(btn);
  });
}

let currentMood = null;

async function selectMood(mood) {
  currentMood = mood;
  await showRecipe(mood);
  document.getElementById('recipe-card').classList.remove('hidden');
}

async function showRecipe(mood) {
  const res = await fetch(`/recipe?mood=${encodeURIComponent(mood)}`);
  if (!res.ok) {
    document.getElementById('recipe-title').textContent = 'No recipe found!';
    document.getElementById('recipe-desc').textContent = '';
    document.getElementById('recipe-steps')?.remove();
    return;
  }
  const recipe = await res.json();
  document.getElementById('recipe-title').textContent = recipe.title;
  document.getElementById('recipe-desc').textContent = recipe.description;

  // Remove old steps if present
  document.getElementById('recipe-steps')?.remove();

  // Add steps as a numbered list
  let steps;
  try {
    steps = JSON.parse(recipe.steps);
  } catch {
    steps = [];
  }
  if (Array.isArray(steps) && steps.length) {
    const ol = document.createElement('ol');
    ol.id = 'recipe-steps';
    ol.className = 'list-decimal list-inside mb-4 text-gray-700';
    steps.forEach(step => {
      const li = document.createElement('li');
      li.textContent = step;
      ol.appendChild(li);
    });
    document.getElementById('recipe-desc').after(ol);
  }
}

document.getElementById('new-recipe').onclick = () => {
  if (currentMood) showRecipe(currentMood);
};

loadMoods(); 