import { redirect } from 'next/navigation'
import React from 'react'

function page() {
  redirect('/resource-management/forecast')
}

export default page
