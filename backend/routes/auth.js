const express = require('express');
const { add, get } = require('../data/user');
const { createJSONToken, isValidPassword } = require('../util/auth');
const { isValidEmail, isValidText } = require('../util/validation');

const router = express.Router();

// Route de création de compte (signup)
router.post('/signup', async (req, res, next) => {
  const data = req.body;
  let errors = {};

  console.log('Received signup request:', data);

  if (!isValidEmail(data.email)) {
    errors.email = 'Invalid email.';
    console.log('Invalid email:', data.email);
  } else {
    try {
      const existingUser = await get(data.email);
      if (existingUser) {
        errors.email = 'Email exists already.';
        console.log('Email already exists:', data.email);
      }
    } catch (error) {
      console.error('Error checking existing user:', error);
    }
  }

  if (!isValidText(data.password, 6)) {
    errors.password = 'Invalid password. Must be at least 6 characters long.';
    console.log('Invalid password. Length is less than 6 characters.');
  }

  if (Object.keys(errors).length > 0) {
    console.log('Validation errors:', errors);
    return res.status(422).json({
      message: 'User signup failed due to validation errors.',
      errors
    });
  }

  try {
    const createdUser = await add(data);
    const authToken = createJSONToken(createdUser.email);
    console.log('User created successfully:', createdUser);
    res
      .status(201)
      .json({ message: 'User created.', user: createdUser, token: authToken });
  } catch (error) {
    console.error('Error creating user:', error);
    next(error);
  }
});

// Route de connexion (login)
router.post('/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  console.log('Received login request:', { email });

  let user;
  try {
    user = await get(email);
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ message: 'Authentication failed.' });
    }
  } catch (error) {
    console.error('Error retrieving user:', error);
    return res.status(401).json({ message: 'Authentication failed.' });
  }

  const pwIsValid = await isValidPassword(password, user.password);
  if (!pwIsValid) {
    console.log('Invalid password for user:', email);
    return res.status(422).json({
      message: 'Invalid credentials.',
      errors: { credentials: 'Invalid email or password entered.' }
    });
  }

  const token = createJSONToken(email);
  console.log('User authenticated successfully:', email);
  res.json({ token });
});

module.exports = router;
