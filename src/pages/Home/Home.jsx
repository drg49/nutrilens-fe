import React, { useEffect } from 'react';
import { getProfiles } from '../../api/profiles';

const Home = () => {
  useEffect(() => {
    getProfiles().then((data) => console.log(data));
  }, []);

  return (
    <>
      <p>This is the home page</p>
    </>
  );
};

export default Home;
