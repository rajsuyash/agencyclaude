const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// SQLite setup
const db = new Database('./recipes.db');

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Get all moods
app.get('/moods', (req, res) => {
  try {
    const rows = db.prepare('SELECT DISTINCT mood FROM recipes').all();
    res.json(rows.map(r => r.mood));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a random recipe for a mood
app.get('/recipe', (req, res) => {
  const mood = req.query.mood;
  if (!mood) return res.status(400).json({ error: 'Mood is required' });
  
  try {
    const rows = db.prepare('SELECT * FROM recipes WHERE mood = ?').all(mood);
    if (!rows.length) return res.status(404).json({ error: 'No recipes found for this mood' });
    const recipe = rows[Math.floor(Math.random() * rows.length)];
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 