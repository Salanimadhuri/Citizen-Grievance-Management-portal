export const passwordRequirements = [
  { id: 'length', label: 'At least 8 characters', test: (pwd) => pwd.length >= 8 },
  { id: 'uppercase', label: 'One uppercase letter (A-Z)', test: (pwd) => /[A-Z]/.test(pwd) },
  { id: 'lowercase', label: 'One lowercase letter (a-z)', test: (pwd) => /[a-z]/.test(pwd) },
  { id: 'number', label: 'One number (0-9)', test: (pwd) => /\d/.test(pwd) },
  { id: 'special', label: 'One special character', test: (pwd) => /[^A-Za-z0-9]/.test(pwd) },
];

export const validatePassword = (password) => {
  return passwordRequirements.map(req => ({
    ...req,
    valid: req.test(password)
  }));
};

export const isPasswordValid = (password) => {
  return passwordRequirements.every(req => req.test(password));
};
