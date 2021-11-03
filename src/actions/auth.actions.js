import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { getFirestore, addDoc, collection, doc, setDoc, where, getDocs, query, updateDoc } from "firebase/firestore"
import { authConstants } from "./constants"

export const SignUp = (user) => {
    console.log("USER", user)
    return async (dispatch) => {

        const db = getFirestore();
        dispatch({
            type: `${authConstants.USER_LOGIN}_REQUEST`,

        })
        console.log(dispatch)
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, user.email, user.password)
            .then((data) => {
                console.log(data)
                // const curretUser=auth.currentUser;
                const name = `${user.firstname} ${user.lastname}`
                updateProfile(auth.currentUser, {
                    displayName: name,
                })
                    .then(() => {
                        //if here it means update successfully.
                        addDoc(collection(db, "users")
                            , {
                                firstname: user.firstname,
                                lastname: user.lastname,
                                uid: data.user.uid,
                                createdAt: new Date(),
                                isOnline: true,
                            })

                            .then(() => {
                                const loggedInUser = {
                                    firstname: user.firstname,
                                    lastname: user.lastname,
                                    uid: data.user.uid,
                                    email: user.email,
                                }
                                localStorage.setItem('user', JSON.stringify(loggedInUser))
                                console.log('User loggedin Successfully..!')
                                dispatch({
                                    type: `${authConstants.USER_LOGIN}_SUCCESS`,
                                    payload: { user: loggedInUser }
                                })
                            })
                            .catch((error) => {
                                console.log(error)
                                dispatch({
                                    type: `${authConstants.USER_LOGIN}_ERROR`,
                                    payload: { error }
                                })
                            })

                    })
            })
            .catch((error) => {
                console.log(error)
            })
    }
}
export const signin = (user) => {
    console.log("USERR", user)
    return async (dispatch) => {
        dispatch({ type: `${authConstants.USER_LOGIN}_REQUEST` })

        const auth = getAuth();
        signInWithEmailAndPassword(auth, user.email, user.password)
            .then(async (userCredential) => {
                // Signed in 
                console.log("USEREMAIL", user.email)
                const data = userCredential.user;
                console.log("DATAA", data)
                const db = getFirestore()
                const q = query(collection(db, "users"), where('uid', '==', data.uid));
                const rec = await getDocs(q);
                console.log("rec", rec);
                rec.forEach(async (doc) => {
                    await updateDoc(doc.ref, {
                        isOnline: true
                    })
                        .then(() => {
                            const name = data.displayName.split(" ");
                            const firstname = name[0];
                            const lastname = name[1];
                            const loggedInUser = {
                                firstname,
                                lastname,
                                uid: data.uid,
                                email: user.email,
                            }
                            console.log("USER DETAILS", loggedInUser)
                            localStorage.setItem('user', JSON.stringify(loggedInUser))
                            dispatch({
                                type: `${authConstants.USER_LOGIN}_SUCCESS`,
                                payload: { user: loggedInUser }
                            })
                        })
                        .catch(error => {
                            console.log(error)
                        })
    
                })
                   
            })

            .catch((error) => {
                console.log("SIGNIN ERROR", error)
                dispatch({
                    type: `${authConstants.USER_LOGIN}_ERROR`,
                    payload: { error }
                })
                const errorCode = error.code;
                const errorMessage = error.message;
            });

    }
}

export const isLoggedUser = () => {
    return async (dispatch) => {
        const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
        if (user) {
            dispatch({
                type: `${authConstants.USER_LOGIN}_SUCCESS`,
                payload: { user }
            })
        }
        else {
            dispatch({
                type: `${authConstants.USER_LOGIN}_ERROR`,
                payload: { error: 'LOGIN IN AGAIN PLEASE' }
            })
        }
    }
}

export const signout = (uid) => {
    return async (dispatch) => {
        dispatch({ type: `${authConstants.USER_LOGOUT}_REQUEST` })
        const db = getFirestore();
        console.log("uid", uid);
        const q = query(collection(db, "users"), where('uid', '==', uid));
        const rec = await getDocs(q);
        console.log("rec", rec);
        rec.forEach(async (doc) => {
            await updateDoc(doc.ref, {
                isOnline: false
            })
                .then(() => {
                    const auth = getAuth();
                    signOut(auth)
                        .then(() => {
                            localStorage.clear()
                            dispatch({ type: `${authConstants.USER_LOGOUT}_SUCCESS` })

                        })
                        .catch((error) => {
                            console.log(error)
                            dispatch({ type: `${authConstants.USER_LOGOUT}_ERROR` })
                        });

                })
                .catch(error => {
                    console.log(error)
                })

        })


    }
}