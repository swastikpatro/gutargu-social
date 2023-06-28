import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, theme } from '@chakra-ui/react';
import App from './App.jsx';
import './index.css';
// import { theme as extendedTheme } from './styles/index.ts';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux/es/exports';
import store from './store/store.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ChakraProvider>
    </Provider>
  </React.StrictMode>
);
