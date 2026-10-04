import { SVGAttributes } from 'react';

export default function ApplicationLogo(props: SVGAttributes<SVGElement>) {
    return (
        <svg
            {...props}
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Soft geometric background container */}
            <rect width="48" height="48" rx="14" fill="#7E9A7B" />
            
            {/* Subtle inner geometric glow / depth */}
            <rect x="2" y="2" width="44" height="44" rx="12" stroke="#CADAC8" strokeOpacity="0.3" strokeWidth="1.5" />

            {/* Duo-Tone Botanical Bloom Blossom */}
            {/* Top Petal - Warm matte blush */}
            <path
                d="M24 10C24 10 20 16 20 20C20 22.2091 21.7909 24 24 24C26.2091 24 28 22.2091 28 20C28 16 24 10 24 10Z"
                fill="#F3D6D4"
                fillOpacity="0.9"
            />
            {/* Left Petal */}
            <path
                d="M10 24C10 24 16 20 20 20C22.2091 20 24 21.7909 24 24C24 26.2091 22.2091 28 20 28C16 28 10 24 10 24Z"
                fill="#FAF8F5"
                fillOpacity="0.85"
            />
            {/* Right Petal */}
            <path
                d="M38 24C38 24 32 20 28 20C25.7909 20 24 21.7909 24 24C24 26.2091 25.7909 28 28 28C32 28 38 24 38 24Z"
                fill="#FAF8F5"
                fillOpacity="0.85"
            />
            {/* Bottom Stem / Artisan Leaf - Botanical olive sage tone */}
            <path
                d="M24 24C24 24 20 30 20 34C20 36.2091 21.7909 38 24 38C26.2091 38 28 36.2091 28 34C28 30 24 24 24 24Z"
                fill="#4F654D"
            />

            {/* Modern Geometric Pistil Center (Inspired by single-storey circular geometry) */}
            <circle cx="24" cy="24" r="3.2" fill="#FAF8F5" />
            <circle cx="24" cy="24" r="1.6" fill="#C87D65" />
        </svg>
    );
}
