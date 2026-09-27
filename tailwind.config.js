/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{ts,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['DM Sans', 'sans-serif'],
				display: ['Manrope', 'sans-serif'],
			},
			colors: {
				ink: '#202923',
				forest: '#174c3a',
				canvas: '#f6f7f5',
			},
		},
	},
	plugins: [],
};
