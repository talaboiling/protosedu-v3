import React from 'react'
import CloseIcon from "@mui/icons-material/Close";

const MessageModal = ({message}) => {
  return (
    <div
        className="studmodal-content"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <p
          style={{
            fontSize: "xx-large",
            maxWidth: "500px",
            textAlign: "center",
            color: "#2060c7",
            padding: "10px",
          }}
        >
          <p>{message}</p>
        </p>
      </div>
  )
}

export default MessageModal