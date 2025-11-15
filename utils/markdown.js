const markdownIt = require("markdown-it");
const hljs = require("highlight.js");

// Plugins
const emoji = require("markdown-it-emoji");
const sup = require("markdown-it-sup");
const sub = require("markdown-it-sub");
const footnote = require("markdown-it-footnote");
const abbr = require("markdown-it-abbr");
const anchor = require("markdown-it-anchor");
const container = require("markdown-it-container");
const codeblocks = require("markdown-it-codeblocks");
const toc = require("markdown-it-table-of-contents");
const deflist = require("markdown-it-deflist");
const mark = require("markdown-it-mark");
const prism = require("markdown-it-prism");
const ins = require("markdown-it-ins");
const attrs = require("markdown-it-attrs");

module.exports = function createMarkdown() {
  const md = markdownIt({
    html: true,
    breaks: true,
    linkify: true,
    typographer: true,
    code: true,

    // 🔥 ESSENCIAL — habilita highlight.js
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return `<pre class="hljs"><code>${
            hljs.highlight(str, { language: lang }).value
          }</code></pre>`;
        } catch (_) {}
      }

      // caso não tenha linguagem: safe escape
      return `<pre class="hljs"><code>aaaaaaä"aa"${md.utils.escapeHtml(
        str
      )}</code>zzz</pre>`;
    },
  });

  md.use(emoji)
    .use(sup)
    .use(sub)
    .use(footnote)
    .use(abbr)
    .use(deflist)
    .use(ins)
    .use(mark)
    .use(prism)
    .use(attrs)
    .use(anchor)
    .use(toc, { includeLevel: [1, 2, 3] })
    .use(container, "note")
    .use(container, "tip")
    .use(container, "warn");

  return md;
};
