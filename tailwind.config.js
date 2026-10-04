import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                // Doff Aesthetic & Muted Palette
                doff: {
                    sand: '#F7F5F0',       // Warm light background
                    canvas: '#FAF8F5',     // Creamy base
                    charcoal: '#2C302E',   // Soft dark text (matte)
                    muted: '#6B705C',      // Muted sage text / secondary
                    border: '#E8E5DE',     // Subtle border
                },
                sage: {
                    50: '#F4F7F4',
                    100: '#E4ECE3',
                    200: '#CADAC8',
                    500: '#7E9A7B',        // Muted natural olive-sage
                    600: '#658062',
                    700: '#4F654D',
                },
                blush: {
                    50: '#FDF7F7',
                    100: '#F9ECEB',
                    200: '#F3D6D4',
                    500: '#D98E87',        // Doff dusty rose
                    600: '#C2756E',
                },
                terracotta: {
                    50: '#FAF3F0',
                    100: '#F4E3DC',
                    500: '#C87D65',        // Warm matte terracotta
                    600: '#B0654D',
                },
            },
        },
    },

    plugins: [forms],
};
