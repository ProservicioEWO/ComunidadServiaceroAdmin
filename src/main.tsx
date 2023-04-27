import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom'

const comunidadTheme = extendTheme({
  colors: {
    navyBlue: {
      50: "#EDF2F8",
      100: "#CCDBEB",
      200: "#ABC4DE",
      300: "#89ACD1",
      400: "#6895C4",
      500: "#477EB8",
      600: "#396593",
      700: "#2B4B6E",
      800: "#1D3249",
      900: "#0E1925"
    },
    cream: {
      "50": "#FFFCFA",
      "100": "#FFF6F2",
      "200": "#FFEFE9",
      "300": "#FFE9E0",
      "400": "#FFE2D7",
      "500": "#FFDCCE",
      "600": "#FFD5C5",
      "700": "#FFCEBC",
      "800": "#FFC7B3",
      "900": "#FFBFAA"
    }
  }
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={comunidadTheme}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>,
)
