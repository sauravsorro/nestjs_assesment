import mongoose from 'mongoose';

export const AUTH_IS_PUBLIC_KEY = 'isPublic';

export function idInvalid(id: string) {
  const isValidId = mongoose.Types.ObjectId.isValid(id);
  if (isValidId) {
    return true;
  } else {
    return false;
  }
}

export function isValidDateFormat(date: string) {
  // Regular expression to check if date is in 'yyyy-mm-dd' format
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(date)) {
    return false;
  }

  // Check if the date is a valid calendar date
  const parsedDate = new Date(date);
  if (!(parsedDate instanceof Date) || isNaN(parsedDate.getTime())) {
    return false;
  }

  // Check if the date is not in the future
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set time to midnight to compare only the date part
  if (parsedDate > today) {
    return false;
  }

  return parsedDate.toISOString().slice(0, 10) === date;
}

export function generatePassword(length: number = 8) {
  const charset =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';
  for (let i = 0; i < length; ++i) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}
