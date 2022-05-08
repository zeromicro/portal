import React from "react"
import styles from "./styles.module.css"
import { items } from "./floatting_items"

const FloatSideBar = () => {
  return (
    <div className={styles.float_sidebar}>
      {items.map((item) => (
        <div key={item.label} className={styles.float_sidebar__container}>
          {item.items.map((imageItem) => (
            <div
              key={imageItem.label}
              className={styles.float_sidebar__img__group}
            >
              <div className={styles.float_sidebar__img__container}>
                <img
                  alt="logo"
                  width={imageItem.width}
                  height={imageItem.height}
                  src={imageItem.url}
                />
                <span>{imageItem.label}</span>
              </div>
            </div>
          ))}
          <span className={styles.float_sidebar__text}>{item.label}</span>
        </div>
      ))}
    </div>
  )
}

export default FloatSideBar
