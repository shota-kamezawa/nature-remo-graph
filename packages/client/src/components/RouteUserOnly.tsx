import { Navigate, useLocation } from 'react-router-dom'

import { useAuthContext } from '../providers/Auth'

export const RouteUserOnly = (props: { element: JSX.Element }) => {
  const { user } = useAuthContext()

  if (!user) {
    return (
      <Navigate replace={false} state={{ from: useLocation() }} to="/signIn" />
    )
  }

  return <>{props.element}</>
}
