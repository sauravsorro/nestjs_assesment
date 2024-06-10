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
