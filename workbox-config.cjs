module.exports = {
	globDirectory: 'dist/',
	globPatterns: [
		'**/*.{css,js,wasm,ico,png,html,json}'
	],
	swDest: 'dist/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	],
	maximumFileSizeToCacheInBytes: 5000000,
	sourcemap: false,
};