import Reflections from '@/common/components/Reflections/Reflections'
import Head from 'next/head'
import Script from 'next/script'

export default function Home() {
	return (
		<>
			<main>
				<Script
					src="https://www.googletagmanager.com/gtag/js?id=G-PTZRTP0QER"
					strategy="afterInteractive"
				/>

				<Script id="google-analytics" strategy="afterInteractive">
					{`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());

                        gtag('config', 'G-PTZRTP0QER');
        `}
				</Script>
			</main>
			<Reflections />
		</>
	)
}
