const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Serve the flipkart_page.html file from the 'public' directory
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'flipkart_page.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
