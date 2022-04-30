import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment"

if (ExecutionEnvironment.canUseDOM) {
  const style = document.createElement("style")
  const id = "codeblock-fouc-curtain"
  style.id = id
  style.innerHTML = '[class^="codeBlockContainer"] { opacity: 0 !important; }'
  document.head.appendChild(style)
  setTimeout(() => {
    document.getElementById(id).remove()
  }, 500)
}
