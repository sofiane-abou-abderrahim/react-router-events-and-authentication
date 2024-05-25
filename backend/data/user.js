const { hash } = require('bcryptjs');
const { v4: generateId } = require('uuid');

const { NotFoundError } = require('../util/errors');
const { readData, writeData } = require('./util');

async function add(data) {
  console.log('Adding user:', data);
  const storedData = await readData();
  const userId = generateId();
  const hashedPw = await hash(data.password, 12);
  if (!storedData.users) {
    storedData.users = [];
  }
  storedData.users.push({ ...data, password: hashedPw, id: userId });
  await writeData(storedData);
  console.log('User added with ID:', userId);
  return { id: userId, email: data.email };
}

async function get(email) {
  console.log('Fetching user with email:', email);
  const storedData = await readData();
  if (!storedData.users || storedData.users.length === 0) {
    console.log('No users found in stored data.');
    throw new NotFoundError('Could not find any users.');
  }

  const user = storedData.users.find(ev => ev.email === email);
  if (!user) {
    console.log('No user found for email:', email);
    throw new NotFoundError('Could not find user for email ' + email);
  }

  console.log('User found:', user);
  return user;
}

exports.add = add;
exports.get = get;
