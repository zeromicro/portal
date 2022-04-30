import { User } from "./types"
import axios from "axios"

function contains(list, item) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].login === item.login) {
      return true
    }
  }
  return false
}
export const getContributors = () => {
  for (let i = 1; i < 5; i++) {
    axios
      .get(
        "https://api.github.com/repos/zeromicro/go-zero/contributors?per_page=100&page=" +
          i.toString(),
      )
      .then((resp) => {
        const data = resp.data
        for (let i = 0; i < data.length; i++) {
          const item = data[i]
          if (contains(contributors, item)) {
            continue
          }
          contributors.push({
            login: item.login,
            avatar_url: item.avatar_url,
            html_url: item.html_url,
          })
        }
      })
      .catch((e) => {
        console.error(e)
      })
  }
  return contributors
}

// default
const contributors: User[] = []
