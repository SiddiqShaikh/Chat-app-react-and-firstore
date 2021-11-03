import { userConstants } from "./constants"
import { addDoc, collection, query, where, onSnapshot, getFirestore, getDocs, orderBy, limit, startAfter, startAt } from "firebase/firestore";


export const getRealtimeuser = (uid) => {
    return async (dispatch) => {
        dispatch({ type: `${userConstants.GET_REALTIME_USER}_REQUEST` })
        const db = getFirestore()
        const q = query(collection(db, "users"),

        );
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const users = [];
            querySnapshot.forEach((doc) => {
                console.log("DOCC", doc)
                if (doc.data().uid != uid) {
                    users.push(doc.data());
                }

            });

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
                    console.log("change type", change.type, change.doc);
                    if ((change.doc.data().user_uid_1 == user.uid_1 && change.doc.data().user_uid_2 == user.uid_2)
                        || change.doc.data().user_uid_1 == user.uid_2 && change.doc.data().user_uid_2 == user.uid_1
                    ) {
                        console.log("running if");
                        if (change.type === "added") {
                            let index = conversations.findIndex(x => x.id === change.doc.id);
                            console.log("add if index",index)
                            conversations = [...conversations];
                            if (index === -1 && change.newIndex === 0) {
                                conversations.push(change.doc);
                                
                            } else {
                                conversations.unshift(change.doc)
                                
                            }
                            console.log("ADDED",conversations)
                             
                        }
                         if (change.type === "removed") {
                            

                                let index = conversations.findIndex(x => x.id === change.doc.id);

                                console.log("remove if index",index,"change.doc.data().id",change.doc.id)
                                conversations = [...conversations];
                                if (index!=-1) {
                                    conversations.splice(index, 1);
                                 
                                }

                                console.log("Removed data", change.doc,"convo",conversations)
    
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
                        if (change.type === "added") {
                            let index = conversations.findIndex(x => x.id === change.doc.id);
                            console.log("add if index",index)
                            conversations = [...conversations];
                            if (index === -1 && change.newIndex === 0) {
                                conversations.push(change.doc)
                                
                                
                            } else {
                                conversations.unshift(change.doc)
                                
                            
                            }
                        }
                        if (change.type === "removed") {
                            console.log("Removed data",change.doc.data())
                            let index = conversations.findIndex(x => x.id === change.doc.id);
                            console.log("remove if index",index)
                            conversations = [...conversations];
                            if (index!==-1) {
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
            
        }

    }
}