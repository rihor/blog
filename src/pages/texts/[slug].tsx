import React from 'react'
import { useRouter } from 'next/router'

const TextPage: React.FC = () => {
  const router = useRouter()

  return <h1>{router.query.slug}</h1>
}

export default TextPage
