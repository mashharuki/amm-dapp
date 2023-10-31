import '../styles/globals.css'
import type { AppProps } from 'next/app'

/**
 * MyApp Component
 * @param param0 
 * @returns 
 */
function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp;
