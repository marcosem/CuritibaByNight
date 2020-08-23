import React from 'react';
import { RouteProps, Route as ReactDOMRoute, Redirect } from 'react-router-dom';
import { useAuth } from '../hooks/auth';

interface NewRouteProps extends RouteProps {
  isPrivate?: boolean;
  component: React.ComponentType;
}

// IsPrivate / IsSigned
// true / true = OK
// true / false = Redirect to Login
// false / true = Redirect to Dashboard
// false / false = OK

const Route: React.FC<NewRouteProps> = ({
  isPrivate = false,
  component: Component,
  ...rest
}) => {
  const { user } = useAuth();

  return (
    <ReactDOMRoute
      {...rest}
      render={({ location }) => {
        return isPrivate === !!user ? (
          <Component />
        ) : (
          <Redirect
            to={{
              pathname: isPrivate ? '/' : '/dashboard',
              state: { from: location },
            }}
          />
        );
      }}
    />
  );
};

export default Route;
