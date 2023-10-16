import App from './App';
import AppHeaderContextProvider from './contexts/AppHeaderContextProvider';
import AuthContextProvider from './contexts/AuthContextProvider';
import comunidadTheme from './shared/comunidadTheme';
import PrimeCSSProvider from './shared/PrimeCSSProvider';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { PrimeReactProvider } from 'primereact/api';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={comunidadTheme}>
      <PrimeReactProvider>
        <PrimeCSSProvider>
          <BrowserRouter>
            <AppHeaderContextProvider>
              <AuthContextProvider>
                <App />
              </AuthContextProvider>
            </AppHeaderContextProvider>
          </BrowserRouter>
        </PrimeCSSProvider>
      </PrimeReactProvider>
    </ChakraProvider>
  </React.StrictMode>
)