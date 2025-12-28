import Script from "next/script";
import { CyberBackground } from "@/components/CyberBackground";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <head>
                <style dangerouslySetInnerHTML={{
                    __html: `
            .whitespace-nowrap {
              display: none;
            }
          `
                }} />
                <Script id="google-tag-manager" strategy="afterInteractive">
                    {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-KDDQ6RLX');
          `}
                </Script>
                <Script
                    src="https://www.googletagmanager.com/gtag/js?id=G-CQ4F903N9X"
                    strategy="afterInteractive"
                />
                <Script id="google-analytics" strategy="afterInteractive">
                    {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-CQ4F903N9X');
          `}
                </Script>
                <meta name="author" content="Abderrahmane Raquibi" />
                <meta name="copyright" content="© 2025 Abderrahmane Raquibi" />
                <meta property="og:image" content="/abderrahmaneraquibi.jpg" />
                <meta name="theme-color" content="#0f172a" />
            </head>

            {/* Cyber city background with towers and flying robots */}
            <CyberBackground />

            {children}

            {/* ElevenLabs ConvAI Widget */}
            <div
                dangerouslySetInnerHTML={{
                    __html: '<elevenlabs-convai agent-id="agent_1301k4n2f78kf7q8wzz0m7n9mdee"></elevenlabs-convai>'
                }}
            />

            <Script
                src="https://unpkg.com/@elevenlabs/convai-widget-embed"
                strategy="afterInteractive"
            />
        </>
    );
}
