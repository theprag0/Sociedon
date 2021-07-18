import { Route, Switch } from 'react-router-dom';
import Home from './components/home/Home';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Messenger from './components/messenger/Messenger';
import './App.css';

function App() {
  return (
    <Switch>
      <Route exact path='/' render={(routeProps) => <Home {...routeProps}/>}/>
      <Route exact path='/register' render={(routeProps) => <Register {...routeProps}/>}/>
      <Route exact path='/login' render={(routeProps) => <Login {...routeProps}/>}/>
      <Route exact path='/messenger/:id' render={(routeProps) => <Messenger {...routeProps}/>}/>
    </Switch>
  );
}

export default App;
