import { translate } from "@docusaurus/Translate"

export const getLocale = () => {
  const locale = translate({ message: "locale-en" })
  return locale.replaceAll("locale-", "")
}
