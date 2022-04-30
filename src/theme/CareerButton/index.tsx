import React from "react"

import styles from "./styles.module.css"
import Button from "@theme/Button"

type Props = {
  title: string
  bambooUrl: string
}

const CareerButton = ({ title, bambooUrl }: Props) => {
  return (
    <section className={styles.container}>
      <hr className={styles.separator} />
      <h4 className={styles.title}>Get in touch!</h4>
      <p className={styles.content}>
        Apply for the {title} position by visiting the link below and submitting
        your personal details. Attach links to your portfolio where relevant
        (LinkedIn, GitHub, personal website, etc.)
      </p>
      <div className={styles.button}>
        <Button to={bambooUrl}>Apply here</Button>
      </div>
    </section>
  )
}

export default CareerButton
