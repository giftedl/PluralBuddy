"use client";

import dynamic from 'next/dynamic';

// Force Client-side rendering on the app (I don't know why doing "use client" doesn't do that by default)
const PluralBuddyRouter = dynamic(() => import('../../../../components/app/router'), {
  ssr: false, // Set ssr to false to exclude from server-side rendering
});

export default function PluralBuddyApp() {
    return <PluralBuddyRouter />
}