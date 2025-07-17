import type { Metadata } from 'next';
import { Reddit_Sans } from 'next/font/google';
import { PlayerProvider } from '@/context/player-context';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

// Set up the font used in your global stylesheet for optimal performance.
const redditSans = Reddit_Sans({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-reddit-sans',
});

// Define metadata for your application for better SEO.
export const metadata: Metadata = {
    title: 'rStatoin - Explosion of Sound',
    description: 'Discover and listen to a variety of radio stations from around the world.',
};

/**
 * This is the root layout component for the application.
 * It wraps all pages with the PlayerProvider to supply global state.
 */
export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
        <body className={redditSans.className}>
        {/* The PlayerProvider wraps your entire application, making player state globally accessible. */}
        <PlayerProvider>
            {children}
        </PlayerProvider>

        {/* The Toaster component is placed here to handle all toast notifications globally. */}
        <Toaster />
        </body>
        </html>
    );
}