import styled from 'styled-components'

export const Main = styled.main`
  position: relative;
  width: 100%;
  height: 100%;
  color: white;
  overflow: hidden;

  > header {
    position: absolute;
    display: inline-block;
    width: 500px;
    top: 50%;
    transform: translate3d(0, -50%, 0);
    left: 10em;
    color: #f0fff0;

    h1 {
      font-size: 8em;
      font-family: 'Playfair Display', serif;
      font-weight: bold;
      line-height: 1em;
    }

    @media only screen and (max-width: 750px) {
      & {
        top: 250px;
        left: 50px;
        font-size: 6em;
        width: 200px;
      }
    }
  }

  a {
    color: #f0fff0;
    font-family: 'Playfair Display', serif;
    position: absolute;
    font-size: 1em;
    text-decoration: none;
    font-size: 1em;
    top: 50px;
    left: 50px;
  }

  canvas {
    width: 100%;
    height: 100%;
  }
`
