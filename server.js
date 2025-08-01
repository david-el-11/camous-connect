const express = require('express');
const bodyParser = require('body-parser');
const XLSX = require('xlsx');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(bodyParser.json({limit: '10mb'}));

const FILE = 'lost_items.xlsx';

app.post('/api/lost', (req, res) => {
  let data = [];
  if (fs.existsSync(FILE)) {
    const wb = XLSX.readFile(FILE);
    const ws = wb.Sheets['LostItems'];
    data = XLSX.utils.sheet_to_json(ws);
  }
  data.push(req.body);

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'LostItems');
  XLSX.writeFile(wb, FILE);

  res.json({ success: true });
});

app.get('/api/lost', (req, res) => {
  if (!fs.existsSync(FILE)) return res.json([]);
  const wb = XLSX.readFile(FILE);
  const ws = wb.Sheets['LostItems'];
  const data = XLSX.utils.sheet_to_json(ws);
  res.json(data);
});

app.listen(3001, () => console.log('Server running on http://localhost:3001'));