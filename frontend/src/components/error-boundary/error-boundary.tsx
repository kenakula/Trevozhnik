import { ReactElement } from 'react';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

export const ErrorBoundary = (): ReactElement => {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return <div>Error response: ${JSON.stringify(error)}</div>;
  }

  return (
    <p>ErrorBoundaryComponent: ${JSON.stringify(error)}</p>
  );
};
