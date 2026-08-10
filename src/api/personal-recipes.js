import { handleResponse } from "../utils/helperMethods";
const root = process.env.REACT_APP_API_ROOT_URL + "/personal-recipes";

export const getPersonalRecipes = async () =>
  handleResponse(
    await fetch(`${root}/`, {
      method: "GET",
    }),
  );

export const uploadPersonalRecipeImage = async (imageBlob) => {
  const formData = new FormData();
  formData.append("image", imageBlob, "capture.jpg");

  return handleResponse(
    await fetch(`${root}/upload`, {
      method: "POST",
      body: formData,
    }),
  );
};
