// Use this validation if all fields in the form are required
export const formContainsEmptyValues = (obj) => {
  if (Object.values(obj).some((val) => val === '')) {
    return true;
  }
  return false;
};
