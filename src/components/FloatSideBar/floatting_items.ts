import { FloatingItem } from "./types"

export const items: FloatingItem[] = [
  {
    items: [
      {
        label: "微信公众号",
        url: require("@site/static/img/pages/index/floating/qrcode.png")
          .default,
        width: 100,
        height: 100,
      },
      {
        label: "微信公众号2",
        url: require("@site/static/img/pages/index/floating/qrcode.png")
          .default,
        width: 100,
        height: 100,
      },
    ],
    label: "加入社区",
  },
  {
    items: [
      {
        label: "",
        url: require("@site/static/img/pages/index/floating/live.png").default,
        width: 300,
        height: 600,
      },
    ],
    label: "直播预告",
  },
]
