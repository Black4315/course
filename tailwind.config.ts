/** @type {import('tailwindcss').Config} */
import plugin from "tailwindcss/plugin";

export default {
    content: [
      "./pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./components/**/*.{js,ts,jsx,tsx,mdx}",
      "./app/**/*.{js,ts,jsx,tsx,mdx}",
      
    ],
    theme: {
      extend: {
        borderRadius: {
          sm: "5px",
        },
        screens: {
          'max-lg2': { 'max': '1260px' },
          'semishort': { 'raw': '(max-height: 600px)' }
        },
        fontFamily: {
          spartan: ["var( --font-spartan)"],
          arabic: ["var( --font-arabic)"],
          gs: ["var(--font-gs)"]
        },
        colors: {
          black:{
            50:'#0f0f0f'
          },
          gray:{
            50:'#e2e2e2',
            100:"#f5f9fa",
            200:'#e6e6e6',
            300:'#b5b1ae',
            400:'#808080',
            500:'#6c6c6c',
            600: '#777',
            700: '#444',
            800:'#1d1d1d',
            border:'#e5e5e5',
            borderprog:'#c8c8c8',
            message_surface:'#e8e8e880'
          },
          red:{
            100:'#e55d86',
            200:'#e54860'
          },
          green:{
            100:'#70b8a5',
            200:'#6abd8a',
            300:'#41b69d',
            success:'#28a745'
          },
          purple:{
            50:'#F5F9FA',
            100:'#485293',
            200:'#46418b',
            300:'#182578',
            400:'#080264'
            
          },
          yellow:{
            100:'#fbd500'
          },
          blue:{
            100:'#5a78fc',
            200:'#3e54b5'
            
          }
        },
      },
    },
    plugins: [
      plugin(function ({ addBase, addComponents, addUtilities }) {
      addBase({});
      addComponents({
   
        ".h1": {
          "@apply font-semibold text-[2.5rem] leading-[3.25rem] md:text-[2.75rem] md:leading-[3.75rem] lg:text-[3.25rem] lg:leading-[4.0625rem] xl:text-[3.75rem] xl:leading-[4.5rem]":
            {},
        },
        ".h2": {
          "@apply font-medium text-[2.1rem] leading-tight ": {},
        },
        ".h3": {
          "@apply font-medium text-[1.75rem] leading-tight":
            {},
        },
        ".h4": {
          "@apply text-[1.4rem] leading-normal ":
            {},
        },
        ".body-1": {
          "@apply text-[1.15rem] leading-6 text-gray-600":
            {},
        },
        ".body-2": {
          "@apply font-light text-[0.875rem] leading-6 md:text-base": {},
        },
       
      });
      
      
    }),
    ],
  };
 