module.exports = {
  siteMetadata: {
    siteTitle: `React observing`,
    defaultTitle: `React observing | Performance-focused library for React state management`,
    siteTitleShort: `React observing`,
    siteDescription: `React observing is a performance-focused state management library for react`,
    siteUrl: `https://react-observing.web.app`,
    siteAuthor: `lvsouza`,
    siteImage: `/og/banner.png`,
    siteLanguage: `en`,
    basePath: `/`,
    themeColor: `#8257E6`,
  },
  flags: { PRESERVE_WEBPACK_CACHE: true },
  plugins: [
    {
      resolve: `@rocketseat/gatsby-theme-docs`,
      options: {
        docsPath: `src/docs`,
        repositoryUrl: `https://github.com/lvsouza/react-observing`,
        baseDir: `docs/`,
        branch: `master`,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `React observing`,
        short_name: `React observing`,
        start_url: `/`,
        background_color: `#8257E6`,
        display: `standalone`,
        icon: `static/favicon.png`,
      },
    },
    `gatsby-plugin-sitemap`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: `UA-99997611-8`,
      },
    },
    {
      resolve: `gatsby-plugin-canonical-urls`,
      options: {
        siteUrl: `https://react-observing.wep.app`,
      },
    },
    `gatsby-plugin-offline`,
  ],
}
