import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'

import { auth } from '../firebase'

const AuthContext = createContext<{
  user: User | null
  loading: boolean
  signIn: () => void
  signOut: () => Promise<void>
}>({} as never)

export const useAuthContext = () => useContext(AuthContext)

export const AuthProvider = (props: { children?: JSX.Element }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const signIn = () => {}

  const signOut = () => auth.signOut()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {!loading && props.children}
    </AuthContext.Provider>
  )
}
