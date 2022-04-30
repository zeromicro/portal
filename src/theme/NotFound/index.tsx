import React from "react"

import Layout from "../Layout"

import styles from "./styles.module.css"

const NotFound = () => (
  <Layout flex title="Page not found">
    <div className={styles.wrapper}>
      <h1 className={styles.title}>404</h1>
      <p className={styles.message}>
        We could not find what you were looking for.
      </p>
    </div>
  </Layout>
)

export default NotFound
