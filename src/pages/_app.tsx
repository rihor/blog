import { AppProps } from 'next/app'
import React from 'react'
import './index.css'

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return <Component {...pageProps} />
}

export default MyApp
