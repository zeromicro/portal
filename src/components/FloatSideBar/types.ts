export type FloatingItem = {
  items: ImageItem[]
  label: string
  style?: {}
  visible?: boolean
}

type ImageItem = {
  url: string
  label: string
  width: number
  height: number
}
