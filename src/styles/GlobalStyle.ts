import { createGlobalStyle } from 'styled-components'

export default createGlobalStyle`
    * {
    margin: 0;
    padding: 0;
    border: 0;
    outline: 0;
    box-sizing: border-box;
    font-family: 'Playfair Display', 'Times New Roman', Times, serif;
  }

  html, body {
    width: 100%;
    height: 100%;
    background: paleturquoise;
  }

  ::selection {
    color: inherit;
    background: #03030a30;
  }

  ul, li {
    list-style: none;
  }

  button {
    cursor: pointer;
  }

  a {
    text-decoration: none;
  }
`