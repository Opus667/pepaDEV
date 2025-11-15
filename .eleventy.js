const yaml = require("js-yaml");
const { DateTime } = require("luxon");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const htmlmin = require("html-minifier");
const createMarkdown = require("./utils/markdown.js");

module.exports = function (eleventyConfig) {
  // Custom Markdown library
  const md = createMarkdown();
  eleventyConfig.setLibrary("md", md);

  // Filtro markdown → permite usar {{ content | markdown | safe }}
  // eleventyConfig.addFilter("markdown", (content) => {
  //   return md.render(content || markdown || "");
  // });

  // Disable automatic use of your .gitignore
  eleventyConfig.setUseGitIgnore(false);

  // Merge data instead of overriding
  eleventyConfig.setDataDeepMerge(true);

  // Human readable date
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
      "dd LLL yyyy"
    );
  });

  // Syntax Highlighting for Code blocks
  eleventyConfig.addPlugin(syntaxHighlight);

  // Support .yaml in _data
  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));

  // Copy static files
  eleventyConfig.addPassthroughCopy({
    "./src/admin/config.yml": "./admin/config.yml",
    "./node_modules/alpinejs/dist/cdn.min.js": "./static/js/alpine.js",
    "./node_modules/prismjs/themes/prism-tomorrow.css":
      "./static/css/prism-tomorrow.css",
  });

  // Copy images
  eleventyConfig.addPassthroughCopy("./src/static/img");

  // Copy favicon
  eleventyConfig.addPassthroughCopy("./src/favicon.ico");

  // Minify HTML
  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    if (outputPath.endsWith(".html")) {
      return htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
    }
    return content;
  });

  return {
    dir: {
      input: "src",
    },
    htmlTemplateEngine: "njk",
  };
};
