'use client'

import React from 'react'
import Layout from './layout'
import { useRouter } from 'next/navigation'

function page() {
  //redirect to CCC dashboard
  const router = useRouter();
  router.push('/ccc/dashboard');
  //

  return (
    <Layout>
      <div>CCC Home Page</div>
    </Layout>
  )
}

export default page