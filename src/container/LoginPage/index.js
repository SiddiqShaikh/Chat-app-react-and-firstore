import React, { useState,useEffect } from 'react'
import Layout from '../../components/Layout'
import Card from '../../components/UI/Card'
import { useDispatch, useSelector } from 'react-redux'
import {isLoggedUser, signin} from '../../actions'
import './style.css'
import { Redirect } from 'react-router'

const LoginPage = (props) => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const auth = useSelector(state=>state.auth)
    // useEffect(() => {
    //     if(!auth.authenticated){
    //        dispatch(isLoggedUser())
    //     }

    // }, [])
    const userLogin=(e)=>{
        if(email==''){
            alert("Email can't be null")
            return;
        }
        if(password==''){
            alert("Email can't be null")
            return;
        }
        dispatch(signin({email,password}))
        console.log("running........")
    }

    if(auth.authenticated){
        return <Redirect to={'/'}/>
    }
    return (
        <Layout><div className="loginContainer">
            <Card><form onSubmit={userLogin}>
                <input
                    name="email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                />
                <input
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                <div>
                    <button type="button" onClick={userLogin}>Login</button>
                </div>
            </form></Card>
        </div></Layout>

    )
}

export default LoginPage
