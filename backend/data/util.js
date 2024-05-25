const fs = require('fs').promises;
const path = require('path');

// Utilisation de path.resolve pour garantir le bon chemin d'accès
const dataFilePath = path.resolve(__dirname, '../events.json');

async function readData() {
  const data = await fs.readFile(dataFilePath, 'utf8');
  return JSON.parse(data);
}

async function writeData(data) {
  await fs.writeFile(dataFilePath, JSON.stringify(data));
}

exports.readData = readData;
exports.writeData = writeData;
