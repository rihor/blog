import type { AppProps } from 'next/app'
import type { JSX } from 'react'

import '../styles/GlobalStyle.scss'

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  return <Component {...pageProps} />
}

export default MyApp
