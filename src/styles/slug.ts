import styled from 'styled-components'

import { Nav as BaseNav } from '../styles/sharedStyles'

export const Background = styled.div``

export const Main = styled.main`
  height: 100%;
  width: 50%;
  margin: 0 auto;

  @media screen and (max-width: 800px) {
    & {
      width: 90%;
    }
  }
`

export const Header = styled.header`
  margin-bottom: 40px;
`

export const Nav = styled(BaseNav)`
  margin: 30px 0 50px 0;
`

export const Text = styled.article`
  color: #fefefe;
  padding-bottom: 100px;

  header {
    h1 {
      font-size: clamp(36px, 42px, 64px);
    }

    h2 {
      opacity: 0.8;
      font-size: clamp(0.8em, 1em, 3em);
    }

    h3 {
      margin: 5px 0;
      font-size: clamp(0.7em, 0.8em, 1em);

      span {
        font-size: 1.2em;
        text-transform: capitalize;
      }
    }
  }

  p {
    font-size: clamp(22px, 26px, 32px);
    text-justify: auto;
    margin: 16px 0;
    line-height: 150%;
  }

  em {
    opacity: 0.9;
  }
`
