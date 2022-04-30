import React, { useState } from "react"
import clsx from "clsx"
import { User } from "./types"
import cuCss from "../../css/index/contributor.module.css"
import seCss from "../../css/section.module.css"
import { getContributors } from "./contributors"

type Props = {
  nbElements: number
}

const Slideshow = ({ nbElements }: Props) => {
  const initValue: User[] = []
  const [data, setData] = React.useState({
    contributors: initValue,
  })
  React.useEffect(() => {
    const contributors = getContributors()
    setData({ contributors })
  }, [])

  const nbPanels = Math.ceil(data.contributors.length / nbElements)
  const panels = Array.from({ length: nbPanels }, (_, index) => index + 1)

  const [index, setIndex] = useState<number>(1)

  const handleClickControl = (index: number) => {
    setIndex(index)
  }

  return (
    <section className={clsx(seCss["section--slim"])}>
      <div className={cuCss.contributor__desktop}>
        {data.contributors.map((user) => (
          <a
            key={user.login}
            href={user.html_url}
            target="_blank"
            rel="noreferrer"
          >
            <img
              alt={user.login}
              height={100}
              width={100}
              src={user.avatar_url}
              className={cuCss.contributor__avatar}
            />
            <p className={cuCss.contributor__username}>{user.login}</p>
          </a>
        ))}
      </div>
      <div className={cuCss.contributor__mobile}>
        {panels.map((i: number) => {
          const panelUsers = data.contributors.slice(
            (i - 1) * nbElements,
            i * nbElements,
          )
          const active =
            i === index ? cuCss.contributor__mobile_panel_active : ""
          return (
            <div
              key={i}
              className={`${cuCss.contributor__mobile_panel} ${active}`}
            >
              {panelUsers.map((user) => (
                <div key={user.login} className={cuCss.contributor__item}>
                  <img
                    alt={user.login}
                    height={150}
                    src={user.avatar_url}
                    width={150}
                  />
                </div>
              ))}
            </div>
          )
        })}
        <div className={cuCss.contributor__mobile_nav}>
          {panels.map((i: number) => {
            const active =
              i === index ? cuCss.contributor__mobile_nav__control_active : ""
            return (
              <div
                key={i}
                className={`${cuCss.contributor__mobile_nav__control} ${active}`}
                onClick={() => handleClickControl(i)}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Slideshow
