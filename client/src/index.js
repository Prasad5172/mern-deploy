import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId="393706794831-fggnef4oudj1qqnu3ncbkce42epk3b0n.apps.googleusercontent.com" >
    <BrowserRouter>
            <App />
    </BrowserRouter>
  </GoogleOAuthProvider>,
);
