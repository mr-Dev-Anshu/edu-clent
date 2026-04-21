'use client'
import React from 'react'
import { useAppSelector } from '@/hooks/useStore'
import { selectAuthUser, selectPermissions } from '@/features/auth/slice'
const Page = () => {
      const user  = useAppSelector(selectAuthUser) ;
      const permission = useAppSelector(selectPermissions)
        console.log(permission)
  return (
    <div>
      
    </div>
  )
}

export default Page