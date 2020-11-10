import styled from 'styled-components'

import Eerie from '../components/R3F/EerieScene'

export const RootContainer = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;

  > div {
    position: absolute;
  }

  canvas {
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
  }
`

export const ContentContainer = styled.section`
  z-index: 1;
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
`

export const Main = styled.main`
  height: 100%;
  width: 80%;
  margin: 0 auto;
`

export const Nav = styled.nav`
  padding: 30px 0 200px 0;

  a {
    font-family: Arial, Helvetica, sans-serif;
    font-size: clamp(10px, 10px + 0.2em, 18px);
    letter-spacing: 4px;
    font-weight: bold;
    color: #fafffa;
  }
`

export const Header = styled.header`
  user-select: none;

  h1 {
    /* font-size: 8em; */
    font-family: 'Playfair Display', serif;
    font-size: clamp(46px, 82px + 5em, 124px);
    font-weight: bold;
    line-height: 1em;
    color: #fafffa;
  }

  button {
    background: #fafffa;
    border-radius: 4px;
    padding: 4px 8px;
    margin-top: 10px;

    a {
      font-family: 'Playfair Display', serif;
      font-size: clamp(12px, 12px + 0.5em, 20px);
      letter-spacing: 1px;
      color: #000;
    }
  }
`

export const EerieScene = styled(Eerie)`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  width: 100%;
  height: 200px;
`
