import { createGlobalStyle } from 'styled-components';
import 'react-perfect-scrollbar/dist/css/styles.css';
import bgImg from '../assets/bg.png';

// background: linear-gradient(0deg, #080707 0%, #989797 100%);

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    outline: 0;
  }

  body {
    color: #d5d5d5;
    -webkit-font-smoothing: antialiased;
    background-attachment: fixed;
    background: url(${bgImg}) repeat;

  }


  body, input, button {
    font-family: 'Roboto', sans-serif;
    font-size: 16px;
  }

  h1, h2, h3, h4, h5, h6, strong {
    font-weight: 500;
  }

  button {
    cursor: pointer;
  }
`;

// background: linear-gradient(0deg, #080707 0%, #989797 100%);
//     background: #282727;
