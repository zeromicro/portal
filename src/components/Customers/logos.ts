import { CustomerLogo } from "./types"

export const getLogos = (lineCount) => {
  const placeholderCount = logos.length % lineCount
  if (placeholderCount !== 0) {
    for (let i = 0; i <= placeholderCount; i++) {
      logos.push({
        src: require("@site/static/img/pages/customers/placeholder.png")
          .default,
        alt: "",
        width: 140,
        height: 56,
        filter: false,
      })
    }
  }
  return logos
}

const logos: CustomerLogo[] = [
  {
    src: require("@site/static/img/pages/customers/xiaoheiban.png").default,
    alt: "晓黑板",
    width: 140,
    height: 56,
    filter: true,
  },
  {
    src: require("@site/static/img/pages/customers/tal.png").default,
    alt: "好未来",
    width: 140,
    height: 56,
    filter: false,
  },
  {
    src: require("@site/static/img/pages/customers/qiniu.png").default,
    alt: "七牛云",
    width: 140,
    height: 56,
    filter: false,
  },
  {
    src: require("@site/static/img/pages/customers/tianyi.png").default,
    alt: "天翼云",
    width: 140,
    height: 56,
    filter: false,
  },
  {
    src: require("@site/static/img/pages/customers/lenovo.png").default,
    alt: "lenovo",
    width: 140,
    height: 56,
    filter: false,
  },
  {
    src: require("@site/static/img/pages/customers/51CTO.png").default,
    alt: "51CTO",
    width: 140,
    height: 56,
    filter: false,
  },
  {
    src: require("@site/static/img/pages/customers/youpaiyun.png").default,
    alt: "又拍云",
    width: 140,
    height: 56,
    filter: false,
  },
  {
    src: require("@site/static/img/pages/customers/yoozoo.png").default,
    alt: "游族网络",
    width: 140,
    height: 56,
    filter: false,
  },
  {
    src: require("@site/static/img/pages/customers/laoyuegou.png").default,
    alt: "捞月狗",
    width: 140,
    height: 56,
    filter: false,
  },
  {
    src: require("@site/static/img/pages/customers/yushu.png").default,
    alt: "玉数科技",
    width: 140,
    height: 56,
    filter: false,
  },
  {
    src: require("@site/static/img/pages/customers/shangbanzu.png").default,
    alt: "上班族",
    width: 140,
    height: 56,
    filter: false,
  },
  {
    src: require("@site/static/img/pages/customers/shikong.png").default,
    alt: "释空",
    width: 140,
    height: 56,
    filter: true,
  },
  {
    src: require("@site/static/img/pages/customers/yousuyun.png").default,
    alt: "优速云",
    width: 130,
    height: 56,
    filter: true,
  },
  {
    src: require("@site/static/img/pages/customers/shuguan.png").default,
    alt: "量冠科技",
    width: 140,
    height: 56,
    filter: false,
  },
  {
    src: require("@site/static/img/pages/customers/diangou.png").default,
    alt: "点购广场",
    height: 30,
    width: 113,
    filter: false,
  },
  {
    src: require("@site/static/img/pages/customers/vspn.png").default,
    alt: "英雄体育",
    width: 140,
    height: 56,
    filter: false,
  },
  {
    src: require("@site/static/img/pages/customers/shidaimaibo.png").default,
    alt: "时代脉搏网络",
    width: 140,
    height: 56,
    filter: true,
  },
  {
    src: require("@site/static/img/pages/customers/fuzamei.png").default,
    alt: "复杂美科技",
    width: 140,
    height: 56,
    filter: false,
  },
  {
    src: require("@site/static/img/pages/customers/youlite.png").default,
    alt: "优利特",
    width: 140,
    height: 56,
    filter: false,
  },
  {
    src: require("@site/static/img/pages/customers/zhicheng.png").default,
    alt: "智橙互动",
    width: 140,
    height: 56,
    filter: false,
  },
  {
    src: require("@site/static/img/pages/customers/jingsi.png").default,
    alt: "鲸思智能科技",
    width: 140,
    height: 56,
    filter: false,
  },
  {
    src: require("@site/static/img/pages/customers/zhengzhouhezhong.png")
      .default,
    alt: "郑州众合互联",
    width: 140,
    height: 56,
    filter: false,
  },
  {
    src: require("@site/static/img/pages/customers/wubianjie.png").default,
    alt: "无变界科技",
    width: 140,
    height: 56,
    filter: false,
  },
  {
    src: require("@site/static/img/pages/customers/shenxinfu.png").default,
    alt: "深信服",
    width: 140,
    height: 56,
    filter: false,
  },
]
