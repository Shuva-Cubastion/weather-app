const express = require('express');
const path = require('path');
const { calculate } = require('./calc');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/calculate', (req, res) => {
  try {
    res.json(calculate(req.query));
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => console.log(`Weather app running on port ${PORT}`));
}
module.exports = app;
