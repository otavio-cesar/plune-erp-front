// import AsyncStorage from "@react-native-community/async-storage";
// import { createContext } from "react";

// export const AppContext = createContext();

// export const appReducer = (state, action) => {
//     switch (action.type) {
//         case 'setSession':
//             return createSessao(state, action)
//         default:
//             return state;
//     }
// }

// export const initialState = {
//     sessao: undefined
// }

// function createSessao(state, action) {
//     const sessao = action.payload.sessao
//     AsyncStorage.setItem("sessao", JSON.stringify(sessao))
//     return { ...state, sessao }
// }