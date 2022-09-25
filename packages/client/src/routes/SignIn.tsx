import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

export default () => {
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
      <button onClick={onClick}>サインイン</button>
    </>
  )
}
