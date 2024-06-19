import { ReactElement } from 'react';
import { useLoaderData } from 'react-router-dom';

export const loader = async () => {
  return fetch('https://pokeapi.co/api/v2/pokemon/ditto').then((response) => response.json());
};

const Dashboard = (): ReactElement => {
  const data = useLoaderData();

  return (
    <div>
      <h1>dashboard page</h1>
      {JSON.stringify(data)}
    </div>
  );
};

export const element = <Dashboard/>;
