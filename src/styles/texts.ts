import styled from 'styled-components'

import { Nav as BaseNav } from './sharedStyles'

export const Background = styled.div``

export const Main = styled.main`
  height: 100%;
  width: 80%;
  margin: 0 auto;

  @media screen and (max-width: 800px) {
    & {
      width: 90%;
    }
  }
`

export const Nav = styled(BaseNav)`
  margin: 30px 0 30px 0;
`

export const TextsContainer = styled.div`
  column-count: 3;
  column-gap: 10px;

  article {
    margin: 0;
    padding: 10px 20px;
    margin-bottom: 10px;
    break-inside: avoid;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    color: #fff;
    font-size: 16px;
    cursor: pointer;

    h1 {
      font-size: clamp(1em, 2em, 3em);
    }

    h2 {
      font-size: clamp(0.6em, 1em, 1em);
      opacity: 0.8;
    }

    p {
      margin: 8px 0px;
      font-size: clamp(18px, 20px, 22px);
      text-align: justify;
      text-justify: auto;
    }

    time {
      opacity: 0.8;
    }
  }

  @media screen and (max-width: 1000px) {
    & {
      column-count: 2;
    }
  }

  @media screen and (max-width: 700px) {
    & {
      column-count: 1;
    }
  }
`
