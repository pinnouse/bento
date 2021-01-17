import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx)
        return { ...initialProps }
    }

    render() {
        return (
            <Html>
                <Head>
                    <title>Bento</title>
                    <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, minimum-scale=1.0" />

                    <meta property="og:type" content="website" />
                    <meta property="og:site_name" content="Bento" />
                    <meta property="og:image" content="/Logo.svg" />
                    
                    <meta name="twitter:card" content="summary" />
                    <meta name="twitter:title" property="og:title" content="Bento" />
                    <meta name="twitter:description" property="og:description" content="Bento is the platform that hopes to supercede all video conferencing apps used in learning environments." />

                    <link rel="preconnect" href="https://fonts.gstatic.com" />
                    <link href="https://fonts.googleapis.com/css2?family=Open+Sans&display=swap" rel="stylesheet" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                    <footer className="fixed bottom-0 w-screen text-center text-xs p-2 select-none">&copy; 2021 Nicholas Wong &amp; Jaemin Han</footer>
                </body>
            </Html>
        )
    }
}

export default MyDocument
