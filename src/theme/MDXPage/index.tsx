import clsx from "clsx"
import { MDXProvider } from "@mdx-js/react"
import React from "react"

import MDXComponents from "@theme/MDXComponents"
import type { Props } from "@theme/MDXPage"
import Layout from "@theme/Layout"

const MDXPage = (props: Props) => {
  const { content: MDXPageContent } = props
  const { frontMatter, metadata } = MDXPageContent
  const { title, description, wrapperClassName } = frontMatter
  const { permalink } = metadata

  return (
    <Layout
      title={title}
      description={description}
      permalink={permalink}
      wrapperClassName={clsx("container", "row", wrapperClassName)}
    >
      <main className="col col--8 col--offset-2">
        <div className="lg padding-vert--lg">
          <MDXProvider components={MDXComponents}>
            <MDXPageContent />
          </MDXProvider>
        </div>
      </main>
    </Layout>
  )
}

export default MDXPage
