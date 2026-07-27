import React, { useEffect } from 'react';
import { getPersonalRecipes } from '../../api/personal-recipes';

const Home = () => {
  useEffect(() => {
    getPersonalRecipes().then((data) => console.log(data));
  }, []);

  return (
    <>
      <p>This is the home page</p>
    </>
  );
};

export default Home;
