import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment"
import siteConfig from "@generated/docusaurus.config"

const prismIncludeLanguages = (PrismObject) => {
  if (ExecutionEnvironment.canUseDOM) {
    const {
      themeConfig: { prism: { additionalLanguages = [] } = {} },
    } = siteConfig
    window.Prism = PrismObject
    additionalLanguages.forEach((lang) => {
      require(`prismjs/components/prism-${lang}`) // eslint-disable-line
    })
    Prism.languages["go-zero"] = {
      comment: {
        pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|(?:--|\/\/).*)/,
        lookbehind: true,
      },
      variable: [
        {
          pattern: /@(["'`])(?:\\[\s\S]|(?!\1)[^\\])+\1/,
          greedy: true,
        },
        /@[\w.$]+/,
      ],
      string: {
        pattern: /(^|[^@\\])("|')(?:\\[\s\S]|(?!\2)[^\\]|\2\2)*\2/,
        greedy: true,
        lookbehind: true,
      },
      function:/(bug|upgrade|env|migrate|api|docker|kube|rpc|model|template|completion|help, h)/,
      keyword: /(goctl)/,
      number: /[+-]?\b\d+(?:(?:\.\d*)?(?:[eE][+-]?\d+)?)?\b|(\#{1,2}([a-zA-Z_$]|[a-zA-Z0-9_$])*)/i,
      operator: /[\+|\-|\/|\/\/|%|<@>|@>|<@|&|\^|~|<|>|<=|=>|==|!=|<>|=|!~]/i,
      punctuation: /[;[\]()`,.]/,
    }
    delete window.Prism
  }
}

export default prismIncludeLanguages
