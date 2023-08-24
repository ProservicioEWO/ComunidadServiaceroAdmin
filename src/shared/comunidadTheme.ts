import { extendTheme } from '@chakra-ui/react';

const activeLabelStyles = {
  transform: "scale(0.85) translateY(-25px)",
  color: "black",
  backgroundColor: "white",
  fontWeight: 600
}

const activeLabelLeftStyles = {
  transform: "scale(0.85) translateX(-25px) translateY(-25px)",
  color: "black",
  backgroundColor: "white",
  fontWeight: 600
}

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
      50: "#FFFCFA",
      100: "#FFF6F2",
      200: "#FFEFE9",
      300: "#FFE9E0",
      400: "#FFE2D7",
      500: "#FFDCCE",
      600: "#FFD5C5",
      700: "#FFCEBC",
      800: "#FFC7B3",
      900: "#FFBFAA"
    }
  },
  components: {
    Form: {
      variants: {
        floating: {
          container: {
            _focusWithin: {
              label: {
                ...activeLabelStyles
              }
            },
            "input:not(:placeholder-shown) + label, .chakra-select__wrapper + label, textarea:not(:placeholder-shown) ~ label, .chakra-input__group > .chakra-input__left-element + input:not(:placeholder-shown) + label": {
              ...activeLabelStyles
            },
            label: {
              top: 0,
              left: 0,
              zIndex: 2,
              position: "absolute",
              backgroundColor: "transparent",
              color: "#A9A9A9",
              fontWeight: "normal",
              pointerEvents: "none",
              mx: 3,
              px: 1,
              my: 3,
              transformOrigin: "left top",
            }
          }
        },
        "floating-left": {
          container: {
            _focusWithin: {
              label: {
                ...activeLabelLeftStyles
              }
            },
            "input:not(:placeholder-shown) + label, .chakra-select__wrapper + label, textarea:not(:placeholder-shown) ~ label, .chakra-input__group > .chakra-input__left-element + input:not(:placeholder-shown) + label": {
              ...activeLabelLeftStyles
            },
            label: {
              top: 0,
              left: 6,
              zIndex: 2,
              position: "absolute",
              backgroundColor: "transparent",
              color: "#A9A9A9",
              fontWeight: "normal",
              pointerEvents: "none",
              mx: 3,
              px: 1,
              my: 3,
              transformOrigin: "left top",
            }
          }
        },
        "floating-date": {
          container: {
            label: {
              top: "-25px",
              left: "-5px",
              zIndex: 2,
              position: "absolute",
              backgroundColor: "white",
              color: "black",
              fontWeight: 600,
              pointerEvents: "none",
              transform: "scale(0.85)",
              mx: 3,
              px: 1,
              my: 3,
            }
          }
        }
      }
    }
  }
})

export default comunidadTheme