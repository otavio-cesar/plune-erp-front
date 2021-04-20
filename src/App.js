import './App.css';
import { Routes } from './config/routes';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#198179',
    }
  },
  overrides: {
    MuiButton: {
     containedPrimary: {
        color: 'white',
      }
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Routes />
      </div>
    </ThemeProvider>
  );
}

export default App;