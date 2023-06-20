import { ColorModeScript } from "@chakra-ui/react";
import NextDocument, { Html, Head, Main, NextScript } from "next/document";
import theme from "../lib/theme";

export default class Document extends NextDocument {
	render() {
		return (
			<Html lang="it">
				<Head>
					<meta name="application-name" content="Horae PWA" />
					<meta name="apple-mobile-web-app-capable" content="yes" />
					<meta name="apple-mobile-web-app-status-bar-style" content="default" />
					<meta name="apple-mobile-web-app-title" content="Horae" />
					<meta name="format-detection" content="telephone=no" />
					<meta name="mobile-web-app-capable" content="yes" />
					<meta name="msapplication-config" content="/icons/browserconfig.xml" />
					<meta name="msapplication-TileColor" content="#2B5797" />
					<meta name="msapplication-tap-highlight" content="no" />
					<link rel="manifest" href="/manifest.json" />
					<link rel="shortcut icon" href="/favicon.ico" />
					<meta property="og:type" content="website" />
					<meta property="og:title" content="Horae PWA" />
					<meta property="og:description" content="Horae, Ci organizziamo?" />
					<meta property="og:site_name" content="Horae" />
					<meta property="og:url" content="https://yourdomain.com" />
					<meta property="og:image" content="https://yourdomain.com/icons/icon-512x512.png" />

					<meta name="description" content="Project research | Mohole" />
					<link rel="icon" href="/favicon.ico" />
				</Head>
				<body>
					{/* 👇 Here's the script */}
					<ColorModeScript initialColorMode={theme.config.initialColorMode} />
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
