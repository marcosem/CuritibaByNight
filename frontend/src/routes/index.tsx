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
import Territories from '../pages/Territories';
import CreatePlayer from '../pages/CreatePlayer';
import UpdatePlayer from '../pages/UpdatePlayer';
import CharacterUpdate from '../pages/CharacterUpdate';
import CharacterUpdateMulti from '../pages/CharacterUpdateMulti';
import AddCharacter from '../pages/AddCharacter';
import AddLocation from '../pages/AddLocation';
import LocationUpdate from '../pages/LocationUpdate';
import LocationCharList from '../pages/LocationCharList';
import CharacterDetails from '../pages/CharacterDetails';
import Challenges from '../pages/Challenges';
import Influences from '../pages/Influences';
import InfluencesStat from '../pages/InfluencesStat';
import Rules from '../pages/Rules';

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
    <Route path="/influences" exact component={Influences} isPrivate />
    <Route
      path="/influences/stat"
      component={InfluencesStat}
      isPrivate
      isStoryteller
    />
    <Route path="/rules" component={Rules} isPrivate />
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
      path="/updatechar/:filter/:charId"
      component={CharacterUpdate}
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
      path="/updatemultichars/:filter"
      component={CharacterUpdateMulti}
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
      path="/territories"
      component={Territories}
      isPrivate
      isStoryteller
    />
    <Route
      path="/localchars"
      component={LocationCharList}
      isPrivate
      isStoryteller
    />
    <Route path="/character/:charId" component={CharacterDetails} isPrivate />
    <Route path="/challenges" component={Challenges} isPrivate />
  </Switch>
);

export default Routes;
