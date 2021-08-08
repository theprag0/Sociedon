import { Route, Switch } from 'react-router-dom';
import { AuthenticationProvider } from './contexts/auth.context';
import { SocketProvider } from './contexts/socket.context';
import { MessengerProvider } from './contexts/messenger.context';
import PrivateRoute from './PrivateRoute';
import Home from './components/home/Home';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Messenger from './components/messenger/Messenger';

function App() {
  return (
    <AuthenticationProvider>
      <SocketProvider>
        <MessengerProvider>
          <Switch>
            <Route exact path='/' render={(routeProps) => <Home {...routeProps}/>}/>
            <Route exact path='/register' render={(routeProps) => <Register {...routeProps}/>}/>
            <Route exact path='/login' render={(routeProps) => <Login {...routeProps}/>}/>
            {/* <Route exact path='/messenger/:id' render={(routeProps) => <Messenger {...routeProps}/>}/> */}
            <PrivateRoute 
              path="/messenger/:id" 
              component={Messenger}  
              redirectPath='/'
            />
          </Switch>
        </MessengerProvider>
      </SocketProvider>
    </AuthenticationProvider>
  );
}

export default App;
