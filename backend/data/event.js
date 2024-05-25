const fs = require('fs').promises;
const path = require('path');
const { v4: generateId } = require('uuid');
const { NotFoundError } = require('../util/errors');
// const { readData, writeData } = require('./util');

// Utilisation de path.resolve pour garantir le bon chemin d'accès
const dataFilePath = path.resolve(__dirname, '../events.json');

async function readData() {
  try {
    console.log('Reading data from:', dataFilePath); // Ajout de log pour vérifier le chemin
    const data = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to read data:', error);
    throw new Error('Could not read events data.');
  }
}

async function writeData(data) {
  try {
    console.log('Writing data to:', dataFilePath); // Ajout de log pour vérifier le chemin
    await fs.writeFile(dataFilePath, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to write data:', error);
    throw new Error('Could not write events data.');
  }
}

async function getAll() {
  const storedData = await readData();
  if (!storedData.events) {
    throw new NotFoundError('Could not find any events.');
  }
  return storedData.events;
}

async function get(id) {
  const storedData = await readData();
  if (!storedData.events || storedData.events.length === 0) {
    throw new NotFoundError('Could not find any events.');
  }

  const event = storedData.events.find(ev => ev.id === id);
  if (!event) {
    throw new NotFoundError('Could not find event for id ' + id);
  }

  return event;
}

async function add(data) {
  const storedData = await readData();
  storedData.events.unshift({ ...data, id: generateId() });
  await writeData(storedData);
}

async function replace(id, data) {
  const storedData = await readData();
  if (!storedData.events || storedData.events.length === 0) {
    throw new NotFoundError('Could not find any events.');
  }

  const index = storedData.events.findIndex(ev => ev.id === id);
  if (index < 0) {
    throw new NotFoundError('Could not find event for id ' + id);
  }

  storedData.events[index] = { ...data, id };

  await writeData(storedData);
}

async function remove(id) {
  const storedData = await readData();
  const updatedData = storedData.events.filter(ev => ev.id !== id);
  await writeData({ ...storedData, events: updatedData });
}

exports.getAll = getAll;
exports.get = get;
exports.add = add;
exports.replace = replace;
exports.remove = remove;
