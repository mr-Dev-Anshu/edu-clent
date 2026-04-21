'use client'
import React from 'react'
import { useAppSelector } from '@/hooks/useStore'
import { selectAuthUser, selectPermissions } from '@/features/auth/slice'
const DashboardPage = () => {
      const user  = useAppSelector(selectAuthUser) ;
      const permission = useAppSelector(selectPermissions)
        console.log(permission)
  return (
    <div>
      
    </div>
  )
}

export default DashboardPage