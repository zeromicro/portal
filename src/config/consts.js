const wechat = "微信群"
const discord = "discord"
const baseUrl = "/"
module.exports = {
  githubOrgUrl: "https://github.com/zeromicro",
  domain: "go-zero.dev",
  baseUrl,
  // 部署时变更
  organizationName: "zeromicro",
  projectName: "portal",
  discord: "discord",
  getImageUrl(label) {
    switch (label) {
      case wechat:
        return "https://raw.githubusercontent.com/zeromicro/zero-doc/main/doc/images/wechat.jpg"
      case discord:
        return `${baseUrl}img/footer/discord.png`
      default:
        return ""
    }
  },
}
