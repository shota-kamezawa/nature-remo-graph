import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { RouteUserOnly } from './components/RouteUserOnly'
import { AuthProvider } from './providers/Auth'

const Home = lazy(() => import('./routes/Home'))
const SignIn = lazy(() => import('./routes/SignIn'))
const SignOut = lazy(() => import('./routes/SignOut'))
const Mock = lazy(() => import('./routes/Mock'))

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route element={<RouteUserOnly element={<Home />} />} path="/" />
            <Route element={<SignIn />} path="/signIn" />
            <Route element={<SignOut />} path="/signOut" />
            <Route element={<Mock />} path="/mock" />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
