
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { BrowserRouter } from "react-router-dom";
import './App.css';
import MasterComponent from "./routes";
import { Provider } from 'react-redux'
import store from './redux/store';

const font = "'Poppins', sans-serif";
function App() {
  const theme = createTheme({
    input: {
      "&::placeholder": {
        opacity: 1,
      },
    },
    palette: {
      primary: {
        main: "#ec344e",
      },

      secondary: {
        main: "#A484BD",
      },
    },
    typography: {
      fontFamily: font,
    },
  });

  return (
    <>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <MasterComponent />
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    </>
  );
}

export default App;
