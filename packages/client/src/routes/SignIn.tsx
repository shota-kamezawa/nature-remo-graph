import { Button } from '@mui/material'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

const SignIn = () => {
  const navigate = useNavigate()

  const onClick = async () => {
    const provider = new GoogleAuthProvider()
    const auth = getAuth()

    try {
      await signInWithPopup(auth, provider)
      navigate('/')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <Button onClick={onClick} variant="contained">
        サインイン
      </Button>
    </>
  )
}

export default SignIn
