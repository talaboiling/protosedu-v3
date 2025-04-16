import React from 'react'
import SeniorRightSidebar from './SeniorRightSidebar'

const RightSidebar = ({user}) => {
  return (
    <>
        {user.grade<2 && <Profile
            user={user}
            isProfileSwitched={isProfileSwitched}
            setIsProfileSwitched={setIsProfileSwitched}
        />}
        {user.grade>=2 && <SeniorRightSidebar
            user={user}
        />}
    </>
  )
}

export default RightSidebar