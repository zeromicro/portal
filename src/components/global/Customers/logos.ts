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
    src: require("@site/static/customers/chinamobile.png").default,
    alt: "中国移动上海产业研究院",
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
  {
    src: require("@site/static/customers/tensee.gif").default,
    alt: "广州腾思信息科技有限公司",
    filter: false,
  },
  {
    src: require("@site/static/customers/gizwits.png").default,
    alt: "广州机智云物联网科技有限公司",
    filter: false,
  },
  {
    src: require("@site/static/customers/yealink.png").default,
    alt: "厦门亿联网络技术股份有限公司",
    filter: true,
  },
  {
    src: require("@site/static/customers/maiyatian.png").default,
    alt: "北京麦芽田网络科技有限公司",
    filter: false,
  },
  {
    src: require("@site/static/customers/fszlkj.png").default,
    alt: "佛山市振联科技有限公司",
    filter: false,
  },
  {
    src: require("@site/static/customers/smart-speech.png").default,
    alt: "苏州智言信息科技有限公司",
    filter: false,
  },
  {
    src: require("@site/static/customers/tssldc.png").default,
    alt: "天枢数链（浙江）科技有限公司",
    filter: true,
  },
  {
    src: require("@site/static/customers/kupu.webp").default,
    alt: "北京数智方科技有限公司",
    filter: false,
  },
  {
    src: require("@site/static/customers/youngwind.png").default,
    alt: "宁波甬风信息科技有限公司",
    filter: false,
  },
  {
    src: require("@site/static/customers/wanjiaan.png").default,
    alt: "深圳市万佳安物联科技股份有限公司",
    filter: true,
  },
  {
    src: require("@site/static/customers/ai4energy.svg").default,
    alt: "西安交通大学智慧能源与碳中和研究中心",
    filter: false,
  },
  {
    src: require("@site/static/customers/teamsfy.png").default,
    alt: "成都创软科技有限责任公司",
    filter: true,
  },
  {
    src: require("@site/static/customers/sonderbase.png").default,
    alt: "Sonderbase Technologies",
    filter: false,
  },
  {
    src: require("@site/static/customers/glorytime.webp").default,
    alt: "上海荣时信息科技有限公司",
    filter: false,
  },
  {
    src: require("@site/static/customers/tongxi.jpg").default,
    alt: "上海同犀智能科技有限公司",
    filter: false,
  },
  {
    src: require("@site/static/customers/h3c.png").default,
    alt: "新华三技术有限公司",
    filter: false,
  },
  {
    src: require("@site/static/customers/emarkdigital.png").default,
    alt: "上海邑脉科技有限公司",
    filter: false,
  },
  {
    src: require("@site/static/customers/xh-iot.png").default,
    alt: "深圳市兴海物联科技有限公司",
    filter: false,
  },
  {
    src: require("@site/static/customers/axera-tech.png").default,
    alt: "爱芯元智半导体股份有限公司",
    filter: false,
  },
  {
    src: require("@site/static/customers/shinevai.png").default,
    alt: "杭州升恒科技有限公司",
    filter: false,
  },
  {
    src: require("@site/static/customers/kunlun.png").default,
    alt: "昆仑万维科技股份有限公司",
    filter: false,
  },
  {
    src: require("@site/static/customers/purecompute.png").default,
    alt: "无锡盛算信息技术有限公司",
    filter: false,
  },
  {
    src: require("@site/static/customers/jht.png").default,
    alt: "深圳市聚货通信息科技有限公司",
    filter: false,
  },
  {
    src: require("@site/static/customers/liandanxia.png").default,
    alt: "浙江银盾云科技有限公司",
    filter: false,
  }
]
