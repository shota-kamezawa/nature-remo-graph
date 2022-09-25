import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { AuthProvider } from './providers/Auth'
import { RouteUserOnly } from './components/RouteUserOnly'

const Home = lazy(() => import('./routes/Home'))
const SignIn = lazy(() => import('./routes/SignIn'))
const SignOut = lazy(() => import('./routes/SignOut'))

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<RouteUserOnly element={<Home />} />} />
            <Route path="/signIn" element={<SignIn />} />
            <Route path="/signOut" element={<SignOut />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
