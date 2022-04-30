import React from "react"
import clsx from "clsx"
import { User } from "./types"
import cuCss from "../../css/index/contributor.module.css"
import seCss from "../../css/section.module.css"
import { getContributors } from "./contributors"

type Props = {
  nbElements: number
}

type State = {
  contributors: User[]
  panels: number[]
  index: number
}

class Slideshow extends React.Component<Props, State> {
  state: State = {
    contributors: this.getLocalContributors(),
    panels: this.getPanels(),
    index: 0,
  }

  componentDidMount() {
    const contributors = this.getLocalContributors()
    const panels = this.getPanels()
    this.setState({
      contributors,
      panels,
      index: 0,
    })
  }

  getLocalContributors() {
    const s = sessionStorage.getItem("contributors")
    if (s == null || s === "" || s === "[]") {
      const contributors = getContributors()
      sessionStorage.setItem("contributors", JSON.stringify(contributors))
      return contributors
    }
    return JSON.parse(s)
  }

  getPanels() {
    const contributors = this.getLocalContributors()
    const nbPanels = Math.ceil(contributors.length / this.props.nbElements)
    return Array.from({ length: nbPanels }, (_, index) => index + 1)
  }

  handleClickControl(i: number) {
    this.setState({
      index: i,
    })
  }

  render() {
    const { nbElements } = this.props
    const { contributors, panels, index } = this.state
    return (
      <section className={clsx(seCss["section--slim"])}>
        <div className={cuCss.contributor__desktop}>
          {contributors.map((user) => (
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
            const panelUsers = contributors.slice(
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
                  onClick={() => this.handleClickControl(i)}
                />
              )
            })}
          </div>
        </div>
      </section>
    )
  }
}

export default Slideshow
