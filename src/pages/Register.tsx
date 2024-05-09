import Flow from '../components/ui/Flow'
import Sidebar from '../components/ui/Sidebar'
import RegisterForm from '../components/user/RegisterForm'
import { FC } from 'react'

const Register: FC = () => {
  return (
    <div className="flex items-center justify-center grid grid-cols-3 gap-4 h-full">
      <div className="col-span-2 h-full">
        <Flow />
      </div>
      <div className="col-span-1 h-full">
        <Sidebar>
          <RegisterForm />
        </Sidebar>
      </div>
    </div>
  )
}
export default Register
