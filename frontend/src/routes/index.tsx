import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Route';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import Players from '../pages/Players';
import Characters from '../pages/Characters';
import Locals from '../pages/Locals';
import CreatePlayer from '../pages/CreatePlayer';
import CharacterUpdate from '../pages/CharacterUpdate';
import AddCharacter from '../pages/AddCharacter';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={SignIn} />
    <Route path="/complete/:id" component={SignUp} />
    <Route path="/forgot-password" component={ForgotPassword} />
    <Route path="/reset-password" component={ResetPassword} />

    <Route path="/dashboard" component={Dashboard} isPrivate />
    <Route path="/profile" component={Profile} isPrivate />

    <Route path="/locals" component={Locals} isPrivate />
    <Route path="/players" component={Players} isPrivate isStoryteller />
    <Route path="/addplayer" component={CreatePlayer} isPrivate isStoryteller />
    <Route
      path="/characters/:filter"
      component={Characters}
      isPrivate
      isStoryteller
    />
    <Route
      path="/updatechar/:filter"
      component={CharacterUpdate}
      isPrivate
      isStoryteller
    />
    <Route
      path="/addchar/:filter"
      component={AddCharacter}
      isPrivate
      isStoryteller
    />
  </Switch>
);

export default Routes;
