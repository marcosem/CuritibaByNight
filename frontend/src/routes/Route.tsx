import React from 'react';
import { RouteProps, Route as ReactDOMRoute, Redirect } from 'react-router-dom';
import { useAuth } from '../hooks/auth';

interface INewRouteProps extends RouteProps {
  isPrivate?: boolean;
  isStoryteller?: boolean;
  component: React.ComponentType;
}

// IsPrivate / IsSigned
// true / true = OK
// true / false = Redirect to Login
// false / true = Redirect to Dashboard
// false / false = OK

const Route: React.FC<INewRouteProps> = ({
  isPrivate = false,
  isStoryteller = false,
  component: Component,
  ...rest
}) => {
  const { user } = useAuth();

  return (
    <ReactDOMRoute
      {...rest}
      render={({ location }) => {
        if (isPrivate === !!user) {
          if ((isStoryteller && user.storyteller) || !isStoryteller) {
            return <Component />;
          }
          return (
            <Redirect
              to={{
                pathname: '/dashboard',
                state: { from: location },
              }}
            />
          );
        }
        return (
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
