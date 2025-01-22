/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://mangaara.vercel.app", // Replace with your actual domain
  generateRobotsTxt: true, // Generates robots.txt file
  sitemapSize: 5000, // Split into multiple files if needed
  exclude: ["/server-sitemap.xml"], // Exclude pages that you don’t want in the sitemap
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: "Googlebot",
        allow: "/",
      },
    ],
  },
};
