import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Abdo Raquibi Portfolio',
        short_name: 'Raquibi',
        description: 'Full-Stack Web Developer Portfolio',
        start_url: '/',
        display: 'standalone',
        background_color: '#050816',
        theme_color: '#050816',
        icons: [
            {
                src: '/logo.png',
                sizes: 'any',
                type: 'image/png',
            },
            {
                src: '/abdo.png',
                sizes: '192x192',
                type: 'image/png',
            },
        ],
    };
}
