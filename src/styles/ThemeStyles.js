import { extendTheme } from '@chakra-ui/react';

const themeMode = {
  initialMode: 'light',
  useThemeColorMode: false,
};

const colors = {
  primaryColor: {
    900: '#082b43',
    800: '#0d476e',
    700: '#13639a',
    600: '#187fc5',
    500: '#1d9bf0',
    400: '#6ebff5',
    300: '#97d1f8',
    200: '#c0e3fb',
    100: '#e8f5fe',
  },
  gray: {
    900: '#171923',
    800: '#1A202C',
    700: '#2D3748',
    600: '#4A5568',
    500: '#718096',
    400: '#A0AEC0',
    300: '#CBD5E0',
    200: '#E2E8F0',
    100: '#EDF2F7',
    50: '#F7FAFC',
  },
  black: '#000',
  white: '#fff',
  transparent: 'transparent',
};

const fonts = {
  heading: 'sans-serif',
  body: 'sans-serif',
};

const styles = {
  global: (props) => ({
    'html, body': {
      bg: props.colorMode === 'dark' ? 'gray.900' : 'whiteAlpha.800',
    },
    body: {
      position: 'relative',
    },
    Button: {
      color: props.colorMode === 'light' ? 'whiteAlpha.900' : 'gray.900',
      bg: props.colorMode === 'light' ? 'red.100' : 'green.500',
      // fontSize: 'xl',
      _hover: {
        bg: props.colorMode === 'light' ? 'blue.700' : 'blue.700',
      },
      _disabled_hover: {
        bg: 'unset',
      },
      borderColor: props.colorMode === 'light' ? 'blue.700' : 'blue.200',
    },

    h2: {
      color: props.colorMode === 'light' ? 'blue.700' : 'blue.200',
    },
    '*::placeholder': {
      color: props.colorMode === 'light' ? 'gray.400' : 'whiteAlpha.700',
    },
  }),
};

export const components = {
  Button: {
    baseStyle: {
      py: '0.5rem',
      minW: 10,
      borderRadius: '2rem',
      _focus: {
        boxShadow: 'transparent',
      },
      letterSpacing: '1.25px',
      transition: 'all .3s ease-in',
      _active: {
        transform: 'scale(.9)',
      },
    },
    variants: {
      solidPrimary: {
        height: 'auto',
        px: '3xl',
        color: 'white',
        bg: 'primaryColor.500',
        _hover: {
          bg: 'primaryColor.600',
        },
        _disabled_hover: {
          bg: 'unset',
        },
        borderColor: 'primaryColor.500',
      },
      iconButton: {
        as: 'span',
        color: 'gray.600',
        fontSize: '1.2rem',
        background: 'transparent',
        borderColor: 'transparent',
        _hover: {
          background: 'transparent',
        },
      },
      outline: {
        background: 'none',
        color: 'primaryColor.500',
        borderColor: 'primaryColor.500',
        _hover: {
          bg: 'primaryColor.500',
          color: 'white',
        },
      },
      link: {
        background: 'transparent',
        color: 'primaryColor.500',
        _hover: {
          background: 'transparent',
          textDecoration: 'none',
        },
      },
    },
  },
};

export const theme = extendTheme({
  colors,
  fonts,
  styles,
  config: themeMode,
  components,
});
