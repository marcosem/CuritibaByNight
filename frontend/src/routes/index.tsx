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
import UpdatePlayer from '../pages/UpdatePlayer';
import CharacterUpdate from '../pages/CharacterUpdate';
import AddCharacter from '../pages/AddCharacter';
import AddLocation from '../pages/AddLocation';
import LocationUpdate from '../pages/LocationUpdate';
import LocationCharList from '../pages/LocationCharList';
import CharacterDetails from '../pages/CharacterDetails';
import Challenges from '../pages/Challenges';
import Influences from '../pages/Influences';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={SignIn} />
    <Route path="/complete/:id" component={SignUp} />
    <Route path="/forgot-password" component={ForgotPassword} />
    <Route path="/reset-password" component={ResetPassword} />

    <Route path="/dashboard" component={Dashboard} isPrivate />
    <Route path="/profile" component={Profile} isPrivate />

    <Route path="/locals/:local" component={Locals} isPrivate />
    <Route path="/locals" component={Locals} isPrivate />
    <Route path="/influences" component={Influences} isPrivate />
    <Route path="/players" component={Players} isPrivate isStoryteller />
    <Route path="/addplayer" component={CreatePlayer} isPrivate isStoryteller />
    <Route
      path="/updateplayer/:id"
      component={UpdatePlayer}
      isPrivate
      isStoryteller
    />
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
    <Route path="/addlocal" component={AddLocation} isPrivate isStoryteller />
    <Route
      path="/updatelocal"
      component={LocationUpdate}
      isPrivate
      isStoryteller
    />
    <Route
      path="/localchars"
      component={LocationCharList}
      isPrivate
      isStoryteller
    />
    <Route path="/character" component={CharacterDetails} isPrivate />
    <Route path="/challenges" component={Challenges} isPrivate />
  </Switch>
);

export default Routes;
