import React, { useEffect, useState } from 'react';
import ReactScrollWheelHandler from "react-scroll-wheel-handler";
import * as Scroll from 'react-scroll';
import InfiniteScroll from 'react-infinite-scroll-component';
import './style.css';
import Layout from '../../components/Layout'
import { useDispatch, useSelector } from 'react-redux';
import { getRealtimeconversation, getRealtimeuser, updateMessage } from '../../actions';
const User = (props) => {
    const { user, onClick } = props;
    return (
        <div onClick={() => onClick(user)} className="displayName">
            <div className="displayPic">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Lionel_Messi_20180626.jpg/220px-Lionel_Messi_20180626.jpg" alt="" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', flex: 1, margin: '0 10px' }}>
                <span style={{ fontWeight: 500 }}>{user.firstname}</span>
                <span className={user.isOnline ? `onlineStatus` : `onlineStatusoff`}></span>
            </div>
        </div>
    )
}
const HomePage = (props) => {
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth)
    const user = useSelector(state => state.user)
    const [chatstart, setchatstart] = useState(false)
    const [chatuser, setChatuser] = useState('')
    const [message, setMessage] = useState('')
    const [useruid, SetUseruid] = useState(null)
    let unsubscribe;
    useEffect(() => {
        unsubscribe = dispatch(getRealtimeuser(auth.uid))
            .then(unsubscribe => {
                return unsubscribe
            })
            .catch(error => {
                console.log(error)
            })

    }, [])

    console.log("USER", user)


    useEffect(() => {
        return () => {
            unsubscribe.then(f => f()).catch(error => console.log(error))
        }
    }, [])

    const initChat = (user) => {
        setchatstart(true)
        setChatuser(`${user.firstname} ${user.lastname}`)
        SetUseruid(user.uid)
        console.log(user)
        dispatch(getRealtimeconversation({ uid_1: auth.uid, uid_2: user.uid }))
    }

    const submitMessage = (e) => {
        const msgObj = {
            user_uid_1: auth.uid,
            user_uid_2: useruid,
            message,
        }
        if (message != null) {
            dispatch(updateMessage(msgObj))
                .then(() => {
                    setMessage('')
                })
        }
        console.log(msgObj)

    }
    console.log("DISPLAY VALUE", user)
    // var lastScrollTop = 0;
    // const scroll = () => {
    //     var st = window.pageYOffset || document.documentElement.scrollTop;
    //     if (st > lastScrollTop) {
    //         user.users.map
    //             (_user => {
    //                 return (

    //                     dispatch(getRealtimeconversation({ uid_1: auth.uid, uid_2: _user.uid }))


    //                 )
    //             })

    //     } else {
            

    //     }
       
    // }
    // element should be replaced with the actual target element on which you have applied scroll, use window in case of no target element.
    // window.addEventListener("scroll", scroll)
    
    // window.addEventListener("wheel", myFunction)
    
  
    
    function myFunction(event) {
        if(event.deltaY<0){
        console.log("calling",user);

        user.users.map
        (_user => {
            return (
                dispatch(getRealtimeconversation({ uid_1: auth.uid, uid_2: _user.uid }))
                )
        })
    }
    else if(event.deltaY>0){
        console.log("DOWN")

    }
    
     
       


    }
  
// useEffect(() => {
//     if(user.display==true){
//         myFunction()
//     }

// }, [myFunction])
   
    
   
    
      

    return (
        <Layout>
            <section className="container">
                <div className="listOfUsers">
                    {
                        user.users.length > 0 ?
                            user.users.map(user => {
                                return (
                                    <User
                                        onClick={initChat}
                                        key={user.uid}
                                        user={user} />
                                )
                            }) : null
                    }
                </div>
                <div className="chatArea">
                    <div className="chatHeader">{
                        chatstart ? chatuser : null
                    }</div>
                    <div id="messageSections" className="messageSections">
                    <ReactScrollWheelHandler
                                                    upHandler={myFunction}
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                    }}
                                                >
          
                        {
                            
                            user.users.length > 0 ?
                                user.users.map
                                    (_user => {
                                        return (
                                            user.display === true ?
                                                <div ></div>
                                                : null
                                        )
                                    }) : null
                            // user.display === true ?
                            //     <button  onClick={() => {
                            //         console.log("UIDS", auth.uid, _user.uid)
                            //         dispatch(getRealtimeconversation({ uid_1: auth.uid, uid_2: _user.uid }))
                            //     }}>more</button>:null
                            // )} ): null
                        }
                        {chatstart ?
                            user.conversations.map(con => <div style={{ textAlign: con.user_uid_1 == auth.uid ? 'right' : 'left' }}>
                                <p className="messageStyle" >{con.message}</p>
                            </div>)
                            : null}


                    </ReactScrollWheelHandler>
                    </div>

                    {chatstart ? <div className="chatControls">
                        <textarea
                            value={message}
                            onChange={(e) => {
                                setMessage(e.target.value)
                            }}
                            placeholder="Write message"
                        />
                        <button onClick={submitMessage}>Send</button>
                    </div> : null}

                </div>
            </section>
        </Layout>
    );
}

export default HomePage;