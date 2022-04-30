/*
 * The purpose of this plugin is to provide a workaround and prevent "flashing" code blocks by delaying their visibility a bit.
 *
 * When docusaurus page has light and dark themes, it's possible for `<CodeBlock/>` component (used to preview code
 * examples) to appear in a wrong theme. This happens only during initial load and is just for a brief moment.
 *
 * A bit more info in docusaurus source: https://github.com/facebook/docusaurus/blob/main/packages/docusaurus-theme-classic/src/theme/CodeBlock/index.tsx#L39-L42
 */

const path = require("path")

module.exports = () => {
  return {
    name: "delay-code-block-appearance",
    getClientModules() {
      return [path.resolve(__dirname, "script.js")]
    },
  }
}
