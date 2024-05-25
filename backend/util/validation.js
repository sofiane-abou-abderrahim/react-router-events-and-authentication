function isValidText(value, minLength = 1) {
  console.log('Validating text:', value);
  return value && value.trim().length >= minLength;
}

function isValidDate(value) {
  console.log('Validating date:', value);
  const date = new Date(value);
  return value && date !== 'Invalid Date';
}

function isValidImageUrl(value) {
  console.log('Validating image URL:', value);
  return value && value.startsWith('http');
}

function isValidEmail(value) {
  console.log('Validating email:', value);
  return value && value.includes('@');
}

exports.isValidText = isValidText;
exports.isValidDate = isValidDate;
exports.isValidImageUrl = isValidImageUrl;
exports.isValidEmail = isValidEmail;
