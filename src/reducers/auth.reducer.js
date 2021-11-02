import { authConstants } from "../actions/constants"

const initState={
    firstname:'',
    lastname:'',
    email:'',
    authenticating:false,
    authenticated:false,
    error:null,
}
export default (state=initState,action)=>{
    switch(action.type){
        case `${authConstants.USER_LOGIN}_REQUEST`:
            state={
                ...state,
                authenticating:true,
            }
            break;
            case `${authConstants.USER_LOGIN}_SUCCESS`:
            state={
                ...state,
                ...action.payload.user,
                authenticating:false,
                authenticated:true,
            }
            break;
            case `${authConstants.USER_LOGIN}_ERROR`:
            state={
                ...state,
                authenticating:false,
                authenticated:false,
                error:action.payload.error,
            }
            break;
            case `${authConstants.USER_LOGOUT}_REQUEST`:
            break;
            case `${authConstants.USER_LOGOUT}_SUCCESS`:
                state={
                    ...initState
                }
            break;
            case `${authConstants.USER_LOGOUT}_ERROR`:
                state={
                    ...state,
                    error:action.payload.error,
                }
            break;
    }
    return state;
}