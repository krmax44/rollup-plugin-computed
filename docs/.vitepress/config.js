module.exports = {
	title: 'computed 📂',
	description: 'Compute data at build time.',
	base: '/rollup-plugin-computed/',
	themeConfig: {
		repo: 'krmax44/rollup-plugin-computed',
		docsDir: 'docs',
		docsBranch: 'main',
		editLinks: true,
		editLinkText: 'Edit this page on GitHub',
		lastUpdated: 'Last Updated',

		nav: [{ text: 'Guide', link: '/guide/', activeMatch: '^/guide/' }],

		sidebar: {
			'/guide/': [
				{
					text: 'Introduction',
					children: [
						{ text: 'What is this plugin?', link: '/guide/' },
						{ text: 'Getting started', link: '/guide/getting-started' }
					]
				},
				{
					text: 'Advanced',
					children: [
						{ text: 'Chunks', link: '/guide/chunks' },
						{ text: 'Assets', link: '/guide/assets' }
					]
				}
			]
		}
	}
};
