import React from 'react'
import { Lock } from 'lucide-react'

const LockedContent = ({message=null}) => {
    return (
        <div style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%", 
            width: "100%", 
            backgroundColor: "rgba(0, 0, 0, .5)", 
            display: "flex", 
            justifyContent:"center",
            alignItems: "center",
            gap: "1rem",
        }}> 
            <Lock size={56}/>
            <p>{message}</p>
        </div>
    )
}

export default LockedContent