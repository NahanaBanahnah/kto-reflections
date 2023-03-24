/** @type {import('next').NextConfig} */

const path = require('path')

const securityHeaders = [
	{
		key: 'X-Frame-Options',
		value: 'SAMEORIGIN',
	},
]

module.exports = {
	reactStrictMode: true,
	sassOptions: {
		includePaths: [path.join(__dirname, 'styles')],
	},

	async headers() {
		return [
			{
				// Apply these headers to all routes in your application.
				source: '/(.*)',
				headers: securityHeaders,
			},
		]
	},
}
