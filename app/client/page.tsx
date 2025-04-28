"use client"
import { useUser } from '@clerk/nextjs'
import React from 'react'

const ClientPage = () => {
    const { isSignedIn, user, isLoaded } = useUser()

    if (!isLoaded) {
      return <div>Loading...</div>
    }
  
    if (!isSignedIn) {
      return <div>Sign in to view this page</div>
    }
  return (
    <div className='h-full flex flex-col items-center justify-center text-2xl'>
        {user.firstName} welcome to clerk</div>
  )
}

export default ClientPage
