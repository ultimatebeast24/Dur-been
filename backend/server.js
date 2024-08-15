const express = require('express');
const app = express();

app.get('/endpoint', (req, res) => {
  const distance = req.query.distance;
  console.log(`Received distance: ${distance} cm`);
  res.send(`Distance received: ${distance} cm`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
