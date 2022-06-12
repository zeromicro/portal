import { FloatingItem } from "./types"

function showLive(){
  const now = new Date().getTime()
  const target = Date.parse("2022-06-18 20:00:00")
  return now < target
}

export const enItems: FloatingItem[] = []
export const cnItems: FloatingItem[] = [
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
        label: "扫码进群",
        url:
          "https://raw.githubusercontent.com/zeromicro/zero-doc/main/doc/images/wechat.jpg",
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
        width: 257,
        height: 520,
      },
    ],
    label: "直播预告",
    style: { background: "#62a8f7" },
    visible: showLive(),
  },
]
