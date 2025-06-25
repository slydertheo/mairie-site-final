import 'bulma/css/bulma.min.css'; // ou "@/styles/globals.css" si tu importes Bulma dedans
import type { AppProps } from "next/app";
import Layout from "@/components/Layout";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
