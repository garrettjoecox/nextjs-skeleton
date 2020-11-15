import { AppProps } from 'next/app';
import '../frontend/styles/global.css';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
