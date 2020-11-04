import { createGlobalStyle } from 'styled-components'

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
  }

  html, body {
    width: 100%;
    height: 100%;
  }

  body {
    background: #03030a;
  }

  ::selection {
    color: inherit;
    background: #03030a30;
  }
`
