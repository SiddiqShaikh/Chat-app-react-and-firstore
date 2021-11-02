import React from 'react';
import { useSelector, useDispatch} from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import { signout } from '../../actions/auth.actions';
import './style.css';



const Header = (props) => {
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch()
  console.log("AUTH",auth)
  return (
    <header className="header">
      <div style={{ display: 'flex' }}>
        <div className="logo">Web Messenger</div>

        {!auth.authenticated ? 
        <ul className="leftMenu">
          <li><NavLink to={'/login'}>Login</NavLink></li>
          <li><NavLink to={'/signup'}>Sign up</NavLink></li> 
          </ul> : null}


      </div>
      <div style={{ margin: '20px 0', color: '#fff', fontWeight: 'bold' }}>
      {auth.authenticated ? `Hi ${auth.firstname}`:null}
      </div>
      <ul className="menu">
      {
        auth.authenticated?
        <li>
          <Link to={'#'} onClick={()=>{
            dispatch(signout(auth.uid))
          }}>Logout</Link>
        </li>
      :null
      }
      </ul>
      
    </header>
  )

}

export default Header