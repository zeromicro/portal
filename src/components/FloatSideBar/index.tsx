import React from "react"
import styles from "./styles.module.css"
import { cnItems, enItems } from "./floatting_items"
import Zoom from "react-medium-image-zoom"
import "react-medium-image-zoom/dist/styles.css"
import { getLocale } from "../../utils"

const defaultShow = true

const FloatSideBar = () => {
  const locale = getLocale()
  let items = enItems
  if (locale === "cn") {
    items = cnItems
  }
  const data = items.filter((item) => item.visible ?? defaultShow)
  return (
    <div className={styles.float_sidebar}>
      {data.map((item) => (
        <div key={item.label} className={styles.float_sidebar__container}>
          <div className={styles.float_sidebar__img__group_container}>
            <div className={styles.float_sidebar__img__group}>
              {item.items.map((imageItem) => (
                <div key={imageItem.label}>
                  <div className={styles.float_sidebar__img__container}>
                    <Zoom
                      overlayBgColorEnd="rgba(0, 0, 0, 0.3)"
                      zoomMargin={150}
                    >
                      <img
                        alt={imageItem.label}
                        width={imageItem.width}
                        height={imageItem.height}
                        src={imageItem.url}
                      />
                    </Zoom>
                    <span>{imageItem.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <span
            className={styles.float_sidebar__text}
            style={item.style ?? item.style}
          >
            {item.label}
          </span>
        </div>
      ))}
    </div>
  )
}

export default FloatSideBar
