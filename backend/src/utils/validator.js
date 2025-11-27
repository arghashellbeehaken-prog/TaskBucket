// Example: validate email
export function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Example: validate password strength
export function isStrongPassword(password) {
  // Minimum 8 chars, at least one letter & one number
  const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return regex.test(password);
}

// Example: validate empty fields
export function isNotEmpty(value) {
  return value !== undefined && value !== null && value.toString().trim() !== "";
}
