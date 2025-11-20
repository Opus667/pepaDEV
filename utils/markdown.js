const MarkdownIt = require("markdown-it");
const mila = require("markdown-it-link-attributes");
const anchor = require("markdown-it-anchor");
const emoji = require("markdown-it-emoji");
const sup = require("markdown-it-sup");
const sub = require("markdown-it-sub");
const footnote = require("markdown-it-footnote");
const abbr = require("markdown-it-abbr");
const container = require("markdown-it-container");
const toc = require("markdown-it-table-of-contents");
const deflist = require("markdown-it-deflist");
const mark = require("markdown-it-mark");
const ins = require("markdown-it-ins");
const attrs = require("markdown-it-attrs");
const expandTabs = require("markdown-it-expand-tabs");
const inline = require("markdown-it-for-inline");
const hljs = require("highlight.js"); // https://highlightjs.org

module.exports = function createMarkdown() {
  const md = MarkdownIt({
    html: true,
    breaks: true,
    linkify: true,
    typographer: true,

    // Highlight apenas para BLOCOS
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return `<pre class="hljs"><code>${
            hljs.highlight(str, { language: lang }).value
          }</code></pre>`;
        } catch (_) {}
      }

      // caso não tenha linguagem: safe escape
      return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
    },
  });

  // █████████████████████████████████████████████████████
  //  INLINE CODE COM O MESMO TRATAMENTO DO BLOCK CODE
  // █████████████████████████████████████████████████████
  md.use(inline, "inline-hljs", "code_inline", function (tokens, idx) {
    const token = tokens[idx];

    // Sempre adiciona a classe
    token.attrSet("class", "hljs");

    // Tenta aplicar highlight inline
    try {
      const content = token.content;

      // Detectar linguagem inline? (ex: `js: console.log()`)
      // Se quiser ignorar isso, basta remover esse bloco.
      const match = content.match(/^(\w+):\s+(.+)/);
      if (match && hljs.getLanguage(match[1])) {
        token.content = hljs.highlight(match[2], {
          language: match[1],
          ignoreIllegals: true,
        }).value;
      } else {
        // fallback seguro
        token.content = md.utils.escapeHtml(content);
      }
    } catch (err) {
      token.content = md.utils.escapeHtml(token.content);
    }
  });

  md.use(emoji)
    .use(mila)
    .use(sup)
    .use(sub)
    .use(footnote)
    .use(abbr)
    .use(deflist)
    .use(ins)
    .use(mark)
    .use(attrs)
    .use(anchor)
    .use(expandTabs, { tabWidth: 4 })
    .use(toc, { includeLevel: [1, 2, 3] })
    .use(container, "note")
    .use(container, "tip")
    .use(container, "warn")

    // 💡 Força HIGHLIGHT em código inline também
    .use(inline, "inline-hljs", "code_inline", function (tokens, idx) {
      const token = tokens[idx];
      token.attrSet("class", "hljs");
      const content = token.content;
      const match = content.match(/^(\w+):\s+(.+)/);
      if (match && hljs.getLanguage(match[1])) {
        token.content = hljs.highlight(match[2], {
          language: match[1],
          ignoreIllegals: true,
        }).value;
      } else {
        token.content = md.utils.escapeHtml(content);
      }
    });

  return md;
};
