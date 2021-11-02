import { userConstants } from "./constants"
import { addDoc, collection, query, where, onSnapshot, getFirestore, getDocs, orderBy, limit, startAfter, startAt } from "firebase/firestore";
import { useState } from "react";

export const getRealtimeuser = (uid) => {
    return async (dispatch) => {
        dispatch({ type: `${userConstants.GET_REALTIME_USER}_REQUEST` })
        const db = getFirestore()
        const q = query(collection(db, "users"),
            // where("state", "!=", uid)
        );
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const users = [];
            querySnapshot.forEach((doc) => {
                console.log("DOCC", doc)
                if (doc.data().uid != uid) {
                    users.push(doc.data());
                }

            });
            //   console.log("users",doc);

            dispatch({
                type: `${userConstants.GET_REALTIME_USER}_SUCCESS`,
                payload: { users },
            })
        });
        return unsubscribe;
    }

}
export const updateMessage = (msgObj) => {
    return async (dispatch) => {
        const db = getFirestore();
        addDoc(collection(db, "conversations")
            , {
                ...msgObj,
                isView: false,
                createdAt: new Date,
            })
            .then((data) => {
                console.log(data)
            })
            .catch((error) => {
                console.log(error)
            })

    }
}

// export const getRealtimeconversation = (user) => {
//     return async (dispatch) => {
//         const db = getFirestore()
//         console.log("RRRRR")

//         const q = query(collection(db, "conversations"), where('user_uid_1', 'in', [user.uid_1, user.uid_2]), orderBy("createdAt", "desc"),limit(5));
//         onSnapshot(q, (querySnapshot) => {
//             const conversations = [];
//             querySnapshot.forEach((doc) => {

//                 if ((doc.data().user_uid_1 == user.uid_1 && doc.data().user_uid_2 == user.uid_2)
//                     || doc.data().user_uid_1 == user.uid_2 && doc.data().user_uid_2 == user.uid_1
//                 ) {

//                     conversations.push(doc.data())

//                 }
//                 if (conversations.length > 0) {
//                     dispatch({
//                         type: userConstants.GET_REALTIME_MESSAGE,
//                         payload: { conversations }
//                     })
//                 }
//                 else {
//                     dispatch({
//                         type: `${userConstants.GET_REALTIME_MESSAGE}_ERROR`,
//                         payload: { conversations }
//                     })
//                 }
//             });
//             // console.log(conversations)
//         })


//     }



// }


// const getPost = async (scope,postId) => {
//     const db = getFirestore()
//     const q = query(collection(db, "conversations"))
//         const rec = await getDocs(q);
//     let collectionRef;
//     if (scope !== null) {
//       collectionRef = scope;
//     }
//     else {
//         const collectionRef = query(collection(db, "conversations"))
//         const rec = await getDocs(collectionRef);
//     }

//     return collectionRef
//       .doc(postId)
//       .get(rec)
//       .then((data)=>{
//         return data.data()
//       })
//       .catch((err)=>{console.error(err)});
//   }
var lastVisible;
var conversations = [];
var n = 5
export const getRealtimeconversation = (user) => {

    return async (dispatch) => {
        const db = getFirestore()
        let display = true;
        if (conversations.length == 0) {
            console.log("RRRRR")
            const q = query(collection(db, "conversations"), where('user_uid_1', 'in', [user.uid_1, user.uid_2]), orderBy("createdAt", "desc"), limit(n));
            const rec = await getDocs(q);
            if (rec.docs.length > 0) {
                lastVisible = rec.docs[rec.docs.length - 1];
                console.log("last", lastVisible);
            }
            if (rec.docs.length < 5) {
                display = false;
            }
            return onSnapshot(q, (querySnapshot) => {
                querySnapshot.docChanges().forEach(async (change) => {
                    console.log("change type", change.type, change.doc.data());
                    if ((change.doc.data().user_uid_1 == user.uid_1 && change.doc.data().user_uid_2 == user.uid_2)
                        || change.doc.data().user_uid_1 == user.uid_2 && change.doc.data().user_uid_2 == user.uid_1
                    ) {
                        console.log("running if");
                        if (change.type == "added") {
                            let index = conversations.findIndex(x => x.id === change.doc.id);
                            if (index === -1 && change.newIndex === 0) {
                                conversations.push(change.doc.data());
                            } else {
                                conversations.unshift(change.doc.data())
                            }
                            // 
                        }
                        else if (change.type == "removed") {

                                let index = conversations.findIndex(x => x.id === change.doc.data().id);
                                if (index !== -1) {
                                    conversations.splice(index, 1);
                                }
    
    
                            }
                        

                        if (conversations.length > 0) {
                            console.log("DISPLAY VALUE FROM ACTION 1", display)
                            dispatch({
                                type: userConstants.GET_REALTIME_MESSAGE,
                                payload: { conversations, display }
                            })
                        }
                        else {
                            dispatch({
                                type: `${userConstants.GET_REALTIME_MESSAGE}_ERROR`,
                                payload: { conversations, display }
                            })
                        }
                        console.log("Conversation", conversations)
                    }
                })
            })
            // return onSnapshot(q, (querySnapshot) => 
            // {


            //     querySnapshot.forEach((doc) => {
            //         console.log("Snapshot",doc)
            //         if ((doc.data().user_uid_1 == user.uid_1 && doc.data().user_uid_2 == user.uid_2)
            //             || doc.data().user_uid_1 == user.uid_2 && doc.data().user_uid_2 == user.uid_1
            //         ) {

            //             conversations.unshift(doc.data())

            //         }
            // if (conversations.length > 0) {
            //     console.log("DISPLAY VALUE FROM ACTION 1",display)
            //     dispatch({
            //         type: userConstants.GET_REALTIME_MESSAGE,
            //         payload: { conversations, display }
            //     })
            // }
            // else {
            //     dispatch({
            //         type: `${userConstants.GET_REALTIME_MESSAGE}_ERROR`,
            //         payload: { conversations,display }
            //     })
            // }
            //     });
            //     console.log("conversations", conversations)
            // })


        }

        else {
            let display = true;
            const q = query(collection(db, "conversations"), where('user_uid_1', 'in', [user.uid_1, user.uid_2]), orderBy("createdAt", "desc"), limit(5), startAfter(lastVisible));
            const rec = await getDocs(q);
            console.log("ELSE", rec.docs.length)

            if (rec.docs.length > 0) {
                lastVisible = rec.docs[rec.docs.length - 1];
                console.log("last", lastVisible);
            }
            if (rec.docs.length < 5) {
                display = false;
            }
            return onSnapshot(q, (querySnapshot) => {
                querySnapshot.docChanges().forEach((change) => {
                    console.log("change type", change.type, change.doc.data());
                    if ((change.doc.data().user_uid_1 == user.uid_1 && change.doc.data().user_uid_2 == user.uid_2)
                        || change.doc.data().user_uid_1 == user.uid_2 && change.doc.data().user_uid_2 == user.uid_1
                    ) {
                        console.log("running if");
                        if (change.type == "added") {
                            let index = conversations.findIndex(x => x.id === change.doc.data().id);
                            if (index === -1 && change.newIndex === 0) {
                                conversations.push(change.doc.data());
                            } else {
                                conversations.unshift(change.doc.data())
                            }
                        }
                        else if (change.type == "removed") {

                            let index = conversations.findIndex(x => x.id === change.doc.data().id);
                            if (index !== -1) {
                                conversations.splice(index, 1);
                            }


                        }

                        if (conversations.length > 0) {
                            console.log("DISPLAY VALUE FROM ACTION 1", display)
                            dispatch({
                                type: userConstants.GET_REALTIME_MESSAGE,
                                payload: { conversations, display }
                            })
                        }
                        else {
                            dispatch({
                                type: `${userConstants.GET_REALTIME_MESSAGE}_ERROR`,
                                payload: { conversations, display }
                            })
                        }
                        console.log("Conversation", conversations)
                    }
                })
            })
            // return onSnapshot(q, (querySnapshot) => 
            // {
            //     if(querySnapshot.docs.length > 0){
            //         querySnapshot.forEach((doc) => {
            //             if ((doc.data().user_uid_1 == user.uid_1 && doc.data().user_uid_2 == user.uid_2)
            //                 || doc.data().user_uid_1 == user.uid_2 && doc.data().user_uid_2 == user.uid_1
            //             ) {

            //                 conversations.unshift(doc.data())

            //             }
            //             if (conversations.length > 0) {
            //                 console.log("DISPLAY VALUE FROM ACTION 2",display)
            //                 dispatch({
            //                     type: userConstants.GET_REALTIME_MESSAGE,
            //                     payload: { conversations, display }
            //                 })
            //             }
            //             else {
            //                 dispatch({
            //                     type: `${userConstants.GET_REALTIME_MESSAGE}_ERROR`,
            //                     payload: { conversations, display }
            //                 })
            //             }
            //         });
            //     }else{
            //         dispatch({
            //             type: userConstants.GET_REALTIME_MESSAGE,
            //             payload: { conversations, display }
            //         })
            //     }

            //     console.log(conversations)
            // })
        }

    }
}