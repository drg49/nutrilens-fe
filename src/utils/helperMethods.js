export const handleResponse = (res) =>
  res.ok
    ? res.json()
    : res.text().then((e) => {
        throw new Error(e);
      });

export const parseError = (error) => JSON.parse(error.message).message;
