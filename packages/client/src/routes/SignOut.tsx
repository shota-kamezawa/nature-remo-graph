import { getAuth } from 'firebase/auth'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const SignOut = () => {
  const navigate = useNavigate()

  useEffect(() => {
    getAuth()
      .signOut()
      .then(() => {
        navigate('/signIn')
      })
  }, [])

  return <></>
}

export default SignOut
