import React from "react"

function Video({ src, ...rest }) {
  return (
    <video autoPlay loop muted playsInline {...rest}>
      <source src={src} type="video/mp4" />
    </video>
  )
}

export default Video
