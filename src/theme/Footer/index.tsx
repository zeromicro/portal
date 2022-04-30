import clsx from "clsx"
import useBaseUrl from "@docusaurus/useBaseUrl"
import useDocusaurusContext from "@docusaurus/useDocusaurusContext"
import React from "react"
import customFields from "../../config/customFields"
import { getImageUrl } from "../../config/consts"
import Button from "@theme/Button"
import useMetadataContext from "@theme/useMetadataContext"

import sectionCss from "../../css/section.module.css"
import footerStyles from "./styles.module.css"
import Translate from "@docusaurus/Translate"

type Props = Readonly<{
  href?: string
  label: string
  to?: string
  src?: string
  url?: string
}>

const FooterLink = ({ to, href, label, ...props }: Props) => {
  const linkHref = useBaseUrl(href ?? "", { forcePrependBaseUrl: undefined })
  const linkTo = useBaseUrl(to ?? "")
  let imageHref = ""
  let imageUrl = ""
  if (href === "image//:") {
    imageHref = getImageUrl(label)
    if (imageHref === "") {
      return <span />
    }
  } else if (to === "image//:") {
    imageUrl = getImageUrl(label)
    if (imageUrl === "") {
      return <span />
    }
  }

  if (label === "-") {
    return <span />
  }
  if (imageUrl !== "") {
    return (
      <img
        alt={label}
        width={80}
        src={imageUrl}
        className={clsx(footerStyles.footer__img)}
      />
    )
  } else if (imageHref !== "") {
    return (
      <img
        alt={label}
        width={80}
        src={imageHref}
        className={clsx(footerStyles.footer__img)}
      />
    )
  } else {
    return (
      <a
        className={footerStyles.footer__link}
        {...(href != null
          ? {
              href: linkHref,
              rel: "noopener noreferrer",
              target: "_blank",
            }
          : { href: linkTo })}
        {...props}
      >
        {label}
      </a>
    )
  }
}

const Footer = () => {
  const { siteConfig } = useDocusaurusContext()
  const metadataContext = useMetadataContext()
  const {
    themeConfig: {
      footer: { links },
    },
  } = siteConfig

  return (
    <footer
      className={clsx(footerStyles.footer, sectionCss.section, {
        [footerStyles["footer--alt"]]: metadataContext.altFooter,
      })}
    >
      <div
        className={clsx(
          footerStyles.footer__inner,
          sectionCss["section--inner"],
        )}
      >
        <div
          className={clsx(
            footerStyles.footer__column,
            footerStyles["footer__column--left"],
          )}
        >
          <div>
            <img
              alt="go-zero logo"
              className={footerStyles.footer__logo}
              height={27}
              src={useBaseUrl("/img/footer/go-zero.svg")}
              title="go-zero"
              width={108}
            />
            <img
              alt="stars"
              height={27}
              src="https://img.shields.io/github/stars/zeromicro/go-zero?style=social"
              className={footerStyles.footer__logo}
            />

            <img
              alt="forks"
              height={27}
              src="https://img.shields.io/github/forks/zeromicro/go-zero?style=social"
              className={footerStyles.footer__logo}
            />
          </div>
          <p className={footerStyles.footer__tagline}>
            <Translate>
              go-zero is a web and rpc framework that with lots of engineering
              practices builtin
            </Translate>
          </p>

          <Button
            className={footerStyles.footer__github}
            href={customFields.githubUrl}
            icon={
              <img
                alt="GitHub logo"
                height={22}
                src={useBaseUrl("/img/github.svg")}
                title="GitHub"
                width={22}
              />
            }
            size="xsmall"
            uppercase={false}
            variant="secondary"
          >
            Star us on GitHub
          </Button>
        </div>

        <div
          className={clsx(
            footerStyles.footer__column,
            footerStyles["footer__column--right"],
          )}
        >
          {links.map((linkItem, i) => (
            <div key={i} className={footerStyles.footer__links}>
              <ul className={footerStyles.footer__items}>
                {linkItem.title != null && (
                  <li className={footerStyles.footer__title}>
                    {linkItem.title}
                  </li>
                )}

                {linkItem.items?.map((item) => (
                  <li
                    className={footerStyles.footer__item}
                    key={item.href ?? item.to}
                  >
                    <FooterLink {...item} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className={footerStyles.footer__bottom}>
        <p className={footerStyles.footer__copyright}>
          {customFields.copyright}
          <ul>
            <li className={footerStyles.footer__item}>
              <a
                className={footerStyles.footer__link}
                href="https://github.com/zeromicro/go-zero/blob/master/LICENSE"
              >
                License
              </a>
            </li>
          </ul>
        </p>
      </div>
    </footer>
  )
}

export default Footer
