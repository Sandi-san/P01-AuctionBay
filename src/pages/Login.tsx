import Flow from '../components/ui/Flow'
import Sidebar from '../components/ui/Sidebar'
import LoginForm from '../components/user/LoginForm'
import { FC } from 'react'

const Login: FC = () => {
  return (
    <div className="flex items-center justify-center grid grid-cols-3 gap-4 h-full">
      <div className="col-span-2">
        <Flow />
      </div>
      <div className="col-span-1">
        <Sidebar>
          <LoginForm />
        </Sidebar>
      </div>
    </div>
  )
}
export default Login
