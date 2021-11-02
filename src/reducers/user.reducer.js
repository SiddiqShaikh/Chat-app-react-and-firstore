import { userConstants } from "../actions/constants"
const initState={
    users:[],
    conversations:[],
    display:true,
}
export default (state=initState,action)=>{
    switch(action.type){
        case `${userConstants.GET_REALTIME_USER}_REQUEST`:
            break;
        case `${userConstants.GET_REALTIME_USER}_SUCCESS`:
            state={
                ...state,
                users:action.payload.users,
                
            }
            break;
        case userConstants.GET_REALTIME_MESSAGE:
            state={
                ...state,
                conversations:action.payload.conversations,
                display:action.payload.display,
            }
            break;
    }
    return state;
}