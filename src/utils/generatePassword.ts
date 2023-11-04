export default function generatePassword(): string {
  const passwordLength = 15;
  const charset =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_+=';

  let password = '';

  const randomLowercase = getRandomChar(charset);
  const randomUppercase = getRandomChar(charset);
  const randomNumber = getRandomChar(charset);
  const randomSpecialChar = getRandomChar(charset);

  password += randomLowercase;
  password += randomUppercase;
  password += randomNumber;
  password += randomSpecialChar;

  for (let i = 0; i < passwordLength - 4; i++) {
    const randomIndex = getRandomIndex(charset);
    password += charset[randomIndex];
  }

  password = shuffleString(password);

  return password;
}

function getRandomChar(charset: string) {
  const randomIndex = getRandomIndex(charset);
  return charset[randomIndex];
}

function getRandomIndex(charset: string) {
  const max = charset.length;
  const randomBytes = Math.floor(Math.random() * max);
  return randomBytes % max;
}

function shuffleString(string: string) {
  const array = string.split('');
  for (let i = array.length - 1; i > 0; i--) {
    const j = getRandomIndex(string);
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.join('');
}
