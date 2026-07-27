import { handleResponse } from '../utils/helperMethods';
const root = process.env.REACT_APP_API_ROOT_URL + '/personal-recipes';

export const getPersonalRecipes = async () =>
  handleResponse(
    await fetch(`${root}/`, {
      method: 'GET',
    }),
  );
