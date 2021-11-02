import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// import firebase from 'firebase';
import { initializeApp } from 'firebase/app';
import { Provider } from 'react-redux';
import store from './store';
const firebaseConfig = {
  apiKey: "AIzaSyAcX1gWuUElFpfZGD0wt4waAl6PO529ngU",
  authDomain: "web-messenger-58174.firebaseapp.com",
  projectId: "web-messenger-58174",
  storageBucket: "web-messenger-58174.appspot.com",
  messagingSenderId: "219494040029",
  appId: "1:219494040029:web:5f258a56fc68d46cdc7634",
  measurementId: "G-DCNVDZ0LW4"
};

console.log("firebaseConfig",firebaseConfig)

initializeApp(firebaseConfig)
window.store=store;
ReactDOM.render(
  <Provider store={store}>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
