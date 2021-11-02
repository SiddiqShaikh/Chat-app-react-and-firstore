import React,{useState} from 'react'
import Layout from '../../components/Layout'
import Card from '../../components/UI/Card'
import {SignUp} from '../../actions'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect } from 'react-router'
const RegisterPage=(props)=> {
    const [firstname,setFirstname]=useState('');
    const [lastname,setLastname]=useState('');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const dispatch=useDispatch();
    const auth = useSelector(state=>state.auth)
    const registerUser=(e)=>{
        console.log("Running")
        
        const user={
            firstname,
            lastname,
            email,
            password,
        }
        
        dispatch(SignUp(user))
        console.log(user)
        
        
        
       
    }
    if(auth.authenticated){
        return <Redirect to={'/'}/>
    }

    return (
        <Layout><div className="registerContainer">
        <Card>
            <form onSubmit={registerUser}>

                <h3>SignUp</h3>
            <input
                    name="firstname"
                    type="text"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    placeholder="Firstname"
                />
                 <input
                    name="lastname"
                    type="text"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    placeholder="Lastname"
                />
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
                    <button type="button" onClick={registerUser}>SignUp</button>
                </div>
            </form>
        </Card>
    </div></Layout>
        
    )
}

export default RegisterPage
