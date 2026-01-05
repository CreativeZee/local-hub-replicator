const app = require('./backend/app.cjs');
const path = require('path');
const express = require('express');

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback route for client-side routing (MUST be last)
app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
