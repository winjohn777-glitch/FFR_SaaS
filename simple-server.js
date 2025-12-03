const express = require('express');
const path = require('path');
const app = express();
const PORT = 8080;

// Serve static files from build directory
app.use(express.static(path.join(__dirname, 'build')));

// Handle React Router - send all requests to index.html
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Florida First Roofing Accounting app running on port ${PORT}`);
  console.log(`📱 Access locally: http://localhost:${PORT}`);
  console.log(`🌐 Ready for tunneling on port ${PORT}`);
});