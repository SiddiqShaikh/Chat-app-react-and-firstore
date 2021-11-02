import React,{useEffect}from 'react';
import './App.css';
import {BrowserRouter as Router,Route} from 'react-router-dom'
import HomePage from './container/Homepage';
import LoginPage from './container/LoginPage';
import RegisterPage from './container/RegisterPage';
import PrivateRoute from './components/PrivateRoute';
import { useDispatch, useSelector } from 'react-redux';
import {isLoggedUser} from './actions'
function App() {
  const auth = useSelector(state=>state.auth)
  const dispatch = useDispatch()
  useEffect(() => {
    if(!auth.authenticated){
       dispatch(isLoggedUser())
    }

}, [])
  return (
    <div className="App">
      <Router>
      <PrivateRoute path="/" exact component={HomePage}/>
      <Route path="/login" component={LoginPage}/>
      <Route path="/signup" component={RegisterPage}/>
      </Router>
    </div>
  );
}

export default App;
