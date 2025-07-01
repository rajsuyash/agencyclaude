const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const PORT = 3000;

// SQLite setup
const db = new sqlite3.Database('./recipes.db');

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Get all moods
app.get('/moods', (req, res) => {
  db.all('SELECT DISTINCT mood FROM recipes', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows.map(r => r.mood));
  });
});

// Get a random recipe for a mood
app.get('/recipe', (req, res) => {
  const mood = req.query.mood;
  if (!mood) return res.status(400).json({ error: 'Mood is required' });
  db.all('SELECT * FROM recipes WHERE mood = ?', [mood], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!rows.length) return res.status(404).json({ error: 'No recipes found for this mood' });
    const recipe = rows[Math.floor(Math.random() * rows.length)];
    res.json(recipe);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 