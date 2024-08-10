import { AppProps } from 'next/app';
import Laylout from '@/components/layouts';
import { ReactElement, ReactNode } from 'react';

type NextPageWithLayout = {
  getLayout?: (page: ReactElement) => ReactNode;
} & React.ComponentType;

type MyAppProps = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: MyAppProps) {
    console.log("entryy");
    
  const getLayout = Component.getLayout || ((page) => <Laylout>{page}</Laylout>);

  return getLayout(<Component {...pageProps} />);
}

export default MyApp;