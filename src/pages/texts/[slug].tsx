import { useRouter } from 'next/router'
import React from 'react'

const TextPage: React.FC = () => {
  const router = useRouter()

  return <h1>{router.query.slug}</h1>
}

export default TextPage
