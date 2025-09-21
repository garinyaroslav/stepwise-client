export const generatePassword = (regex: RegExp): string | null => {
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "@#$%^&+=";

  const allChars = lower + upper + numbers + symbols;
  const maxAttempts = 5;

  const generate = () => {
    let password = "";

    password += lower[Math.floor(Math.random() * lower.length)]; // lowercase
    password += upper[Math.floor(Math.random() * upper.length)]; // uppercase
    password += numbers[Math.floor(Math.random() * numbers.length)]; // digit
    password += symbols[Math.floor(Math.random() * symbols.length)]; // symbol

    for (let i = password.length; i < 12; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    return password
      .split("")
      .sort(() => 0.5 - Math.random())
      .join("");
  };

  let attempts = 0;
  let password = generate();

  while (regex.test(password) && attempts < maxAttempts) {
    password = generate();
    attempts++;
  }

  return regex.test(password) ? password : null;
};
