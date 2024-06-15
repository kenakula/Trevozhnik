import { ErrorResponse } from 'react-router-dom';

export interface IDashboardPageLoader {
  data: string;
}

export const dashboardLoader = async (): Promise<IDashboardPageLoader> => {
  try {
    const data = await fetch('https://pokeapi.co/api/v2')
      .then(res => res.json())
      .then(res => JSON.stringify(res));

    return { data };
  } catch (err) {
    const error = err as ErrorResponse;
    throw new Response('Not Found', { status: 404, statusText: error.data });
  }
};
