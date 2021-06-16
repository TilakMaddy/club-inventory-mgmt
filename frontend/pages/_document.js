import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

export default class MyDocument extends Document {

  // This will only run on the server once

  static getInitialProps({ renderPage }) {
    const sheet = new ServerStyleSheet();
    const page = renderPage(App => props => sheet.collectStyles(
      <App {...props}/>
    ));
    const styleTags = sheet.getStyleElement();
    return { ...page, styleTags};
  }

  render() {
    return (
      <Html lang="en-US">
        <Head>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}