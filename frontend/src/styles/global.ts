import { createGlobalStyle } from 'styled-components';
import bgImg from '../assets/bg.png';

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    outline: 0;
  }

  html {
    scroll-behavior: smooth;
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

  :root {
    --cbn-neutral-1: #ffffff;
    --cbn-neutral-2: #e0e0e0;
    --cbn-neutral-3: #c6c6c6;
    --cbn-neutral-4: #262626;
    --cbn-storyteller-border: #ffd700;
    --cbn-player-border: #cc030e;
    --cbn-red-1: #860209;
    --cbn-green-1: #025609;

    --background-white: var(--cbn-neutral-1);
    --background-grey: var(--cbn-neutral-2);
    --background-red: var(--cbn-red-1);
    --background-green: var(--cbn-green-1);

    --level-common: #707b7c;
    --level-uncommon: #075202;
    --level-rare: #032fc9;
    --level-very-rare: #5d0798;
    --level-epic: #ff5733;
  }
`;
