import clsx from "clsx"
import useDocusaurusContext from "@docusaurus/useDocusaurusContext"
import React, { ComponentProps, useCallback, useState, useEffect } from "react"

import Toggle from "@theme/Toggle"
import useLockBodyScroll from "@theme/hooks/useLockBodyScroll"
import useWindowSize, { windowSizes } from "@theme/hooks/useWindowSize"

import styles from "./styles.module.css"
import NavbarItem from "@theme/NavbarItem"
import LocaleDropdownNavbarItem from "../NavbarItem"

import { useThemeConfig } from "@docusaurus/theme-common"
import useThemeContext from "@theme/hooks/useThemeContext"
import useBaseUrl from "@docusaurus/useBaseUrl"

const DefaultNavItemPosition = "right"
const DefaultNavItemType = "none"

function useColorModeToggle() {
  const {
    colorMode: { disableSwitch },
  } = useThemeConfig()
  const { isDarkTheme, setLightTheme, setDarkTheme } = useThemeContext()
  const toggle = useCallback(
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    (e) => (e.target.checked ? setDarkTheme() : setLightTheme()),
    [setLightTheme, setDarkTheme],
  )
  return { isDarkTheme, toggle, disabled: disableSwitch }
}

function isItem(position, item) {
  return (
    (item.position ?? DefaultNavItemPosition) === position &&
    item.type !== "localeDropdown"
  )
}
function splitNavItemsByPosition(
  items: Array<ComponentProps<typeof NavbarItem>>,
): {
  leftItems: Array<ComponentProps<typeof NavbarItem>>
  rightItems: Array<ComponentProps<typeof NavbarItem>>
  localItems: Array<ComponentProps<typeof NavbarItem>>
} {
  const leftItems = items.filter((item) => isItem("left", item))
  const rightItems = items.filter((item) => isItem("right", item))
  const localItems = items.filter(
    (item) =>
      // @ts-expect-error: temporary, will be fixed in Docusaurus TODO remove soon
      (item.type ?? DefaultNavItemType) === "localeDropdown",
  )
  return {
    leftItems,
    rightItems,
    localItems,
  }
}

function Navbar(): JSX.Element {
  const {
    siteConfig: {
      themeConfig: {
        navbar: { items },
      },
    },
  } = useDocusaurusContext()
  const [sidebarShown, setSidebarShown] = useState(false)

  useLockBodyScroll(sidebarShown)

  const showSidebar = useCallback(() => {
    setSidebarShown(true)
  }, [])
  const hideSidebar = useCallback(() => {
    setSidebarShown(false)
  }, [])

  const windowSize = useWindowSize()

  const colorModeToggle = useColorModeToggle()

  useEffect(() => {
    if (windowSize === windowSizes.desktop) {
      setSidebarShown(false)
    }
  }, [windowSize])

  const { leftItems, rightItems, localItems } = splitNavItemsByPosition(items)

  return (
    <nav
      className={clsx(
        "navbar",
        styles.navbar,
        "navbar--light",
        "navbar--fixed-top",
        {
          "navbar-sidebar--show": sidebarShown,
        },
      )}
    >
      <div className={clsx("navbar__inner", styles.inner)}>
        <div className="navbar__items">
          <div
            aria-label="Navigation bar toggle"
            className="navbar__toggle"
            role="button"
            tabIndex={0}
            onClick={showSidebar}
            onKeyDown={showSidebar}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 30 30"
              role="img"
              focusable="false"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeMiterlimit="10"
                strokeWidth="2"
                d="M4 7h22M4 15h22M4 23h22"
              />
            </svg>
          </div>
          <a className={styles.brand} href={useBaseUrl("/")}>
            <img
              alt="logo"
              height={30}
              src={useBaseUrl("img/navbar/logo.svg")}
              className={clsx(styles.brand_logo)}
            />
            <a className={clsx("navbar__brand", styles.brand_name)}>go-zero</a>
          </a>
          {leftItems.map((item, i) => (
            <NavbarItem {...item} key={i} />
          ))}
        </div>
        <div className="navbar__items navbar__items--right">
          {rightItems.map((item, i) => (
            <NavbarItem {...item} key={i} />
          ))}
          {localItems.map((item, i) => (
            <LocaleDropdownNavbarItem type {...item} key={i} />
          ))}

          <a
            href="https://github.com/zeromicro/go-zero"
            className="navbar__items navbar__items--right"
          >
            <img
              alt="forks"
              height={30}
              src={useBaseUrl("img/navbar/github.svg")}
              className={styles.star__fork}
            />
            <div className={styles.star_fork_layout}>
              <img
                alt="stars"
                height={20}
                src="https://img.shields.io/github/stars/zeromicro/go-zero?style=social"
                className={styles.star__fork}
              />
              <img
                alt="forks"
                height={20}
                src="https://img.shields.io/github/forks/zeromicro/go-zero?style=social"
                className={styles.star__fork}
              />
            </div>
          </a>
          {!colorModeToggle.disabled && (
            <Toggle
              className={styles.themeToggleInHeading}
              checked={colorModeToggle.isDarkTheme}
              onChange={colorModeToggle.toggle}
            />
          )}
        </div>
      </div>

      <div
        role="presentation"
        className="navbar-sidebar__backdrop"
        onClick={hideSidebar}
      />
      <div className="navbar-sidebar">
        <div className="navbar-sidebar__brand">
          <a
            className={clsx("navbar__brand", styles.brand)}
            href={useBaseUrl("/")}
            onClick={hideSidebar}
          >
            go-zero
          </a>

          {!colorModeToggle.disabled && (
            <Toggle
              className={styles.themeToggleInSidebar}
              checked={colorModeToggle.isDarkTheme}
              onChange={colorModeToggle.toggle}
            />
          )}
        </div>
        <div className="navbar-sidebar__items">
          <div className="menu">
            <ul className="menu__list">
              {items.map((item, i) => (
                <NavbarItem
                  mobile
                  {...item}
                  {...(item.type !== "search" && { onClick: hideSidebar })} // Search type def does not accept onClick
                  key={i}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
