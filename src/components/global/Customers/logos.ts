import { CustomerLogo } from "./types"

export const getLogos = (lineCount) => {
  const placeholderCount = logos.length % lineCount
  if (placeholderCount !== 0) {
    for (let i = 0; i <= placeholderCount; i++) {
      logos.push({
        src: require("@site/static/customers/placeholder.png")
          .default,
        alt: "",
        filter: false,
      })
    }
  }
  return logos
}

const logos: CustomerLogo[] = [
  {
    src: require("@site/static/customers/xiaoheiban.png").default,
    alt: "晓黑板",
    filter: true,
  },
  {
    src: require("@site/static/customers/tal.png").default,
    alt: "好未来",
    filter: false,
  },
  {
    src: require("@site/static/customers/qiniu.png").default,
    alt: "七牛云",
    filter: false,
  },
  {
    src: require("@site/static/customers/keep.png").default,
    alt: "keep",
    filter: true,
  },
  {
    src: require("@site/static/customers/tianyi.png").default,
    alt: "天翼云",
    filter: false,
  },
  {
    src: require("@site/static/customers/lenovo.png").default,
    alt: "lenovo",
    filter: false,
  },
  {
    src: require("@site/static/customers/51CTO.png").default,
    alt: "51CTO",
    filter: false,
  },
  {
    src: require("@site/static/customers/youpaiyun.png").default,
    alt: "又拍云",
    filter: false,
  },
  {
    src: require("@site/static/customers/yoozoo.png").default,
    alt: "游族网络",
    filter: false,
  },
  {
    src: require("@site/static/customers/dewu.png").default,
    alt: "得物",
    filter: false,
  },
  {
    src: require("@site/static/customers/laoyuegou.png").default,
    alt: "捞月狗",
    filter: false,
  },
  {
    src: require("@site/static/customers/yunxi.png").default,
    alt: "云犀",
    filter: false,
  },
  {
    src: require("@site/static/customers/hotmax.png").default,
    alt: "好特卖",
    filter: true,
  },
  {
    src: require("@site/static/customers/yushu.png").default,
    alt: "玉数科技",
    filter: false,
  },
  {
    src: require("@site/static/customers/qianfanyun.png").default,
    alt: "千帆云",
    filter: false,
  },
  {
    src: require("@site/static/customers/shangbanzu.png").default,
    alt: "上班族",
    filter: false,
  },
  {
    src: require("@site/static/customers/xshoppy.png").default,
    alt: "赛凌科技",
    filter: false,
  },
  {
    src: require("@site/static/customers/samhotele.png").default,
    alt: "三合通信",
    filter: false,
  },
  {
    src: require("@site/static/customers/shikong.png").default,
    alt: "释空",
    filter: true,
  },
  {
    src: require("@site/static/customers/yousuyun.png").default,
    alt: "优速云",
    filter: true,
  },
  {
    src: require("@site/static/customers/shuguan.png").default,
    alt: "量冠科技",
    filter: false,
  },
  {
    src: require("@site/static/customers/zhongke.png").default,
    alt: "中科生活",
    filter: false,
  },
  {
    src: require("@site/static/customers/indochat.png").default,
    alt: "indochat",
    filter: false,
  },
  {
    src: require("@site/static/customers/shuzan.png").default,
    alt: "数赞",
    filter: false,
  },
  {
    src: require("@site/static/customers/diangou.png").default,
    alt: "点购广场",
    filter: false,
  },
  {
    src: require("@site/static/customers/vspn.png").default,
    alt: "英雄体育",
    filter: false,
  },
  {
    src: require("@site/static/customers/shidaimaibo.png").default,
    alt: "时代脉搏网络",
    filter: true,
  },
  {
    src: require("@site/static/customers/fuzamei.png").default,
    alt: "复杂美科技",
    filter: false,
  },
  {
    src: require("@site/static/customers/youlite.png").default,
    alt: "优利特",
    filter: false,
  },
  {
    src: require("@site/static/customers/zhicheng.png").default,
    alt: "智橙互动",
    filter: false,
  },
  {
    src: require("@site/static/customers/jingsi.png").default,
    alt: "鲸思智能科技",
    filter: false,
  },
  {
    src: require("@site/static/customers/zhengzhouhezhong.png")
      .default,
    alt: "郑州众合互联",
    filter: false,
  },
  {
    src: require("@site/static/customers/wubianjie.png").default,
    alt: "无变界科技",
    filter: false,
  },
  {
    src: require("@site/static/customers/xinkezhi.png").default,
    alt: "馨科智",
    filter: false,
  },
  {
    src: require("@site/static/customers/yijing.png").default,
    alt: "亿景智联",
    filter: true,
  },
  {
    src: require("@site/static/customers/clobotics.png").default,
    alt: "扩博智能",

    filter: true,
  },
  {
    src: require("@site/static/customers/shenxinfu.png").default,
    alt: "深信服",
    filter: false,
  },
  {
    src: require("@site/static/customers/victory_soft.png").default,
    alt: "胜软科技",
    filter: false,
  },
  {
    src: require("@site/static/customers/gaodeer.png").default,
    alt: "高小鹿",
    filter: false,
  },
  {
    src: require("@site/static/customers/open-dapper.png").default,
    alt: "飞视（苏州）数字技术",
    filter: false,
  },
  {
    src: require("@site/static/customers/uniontech.jpeg").default,
    alt: "统信软件",
    filter: false,
  },
  {
    src: require("@site/static/customers/csdh.png").default,
    alt: "鼎翰文化股份有限公司",
    filter: true,
  },
  {
    src: require("@site/static/customers/puerhub.png").default,
    alt: "茶码纹化",
    filter: false,
  },
  {
    src: require("@site/static/customers/eiwq.png").default,
    alt: "武汉沃柒科技有限公司",
    filter: false,
  },
  {
    src: require("@site/static/customers/tinkdance.png").default,
    alt: "叮当跳动",
    filter: false,
  },
  {
    src: require("@site/static/customers/simbam.png").default,
    alt: "simba innovation",
    filter: false,
  },
  {
    src: require("@site/static/customers/xm.png").default,
    alt: "安徽寻梦投资发展集团",
    filter: false,
  },
]
