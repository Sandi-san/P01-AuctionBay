import Flow from '../components/ui/Flow'
import Sidebar from '../components/ui/Sidebar'
import ForgotPasswordForm from '../components/user/ForgotPasswordForm'
import { FC } from 'react'

const Password: FC = () => {
  return (
    <div className="flex items-center justify-center grid grid-cols-3 gap-4 h-full">
      <div className="col-span-2 h-full">
        <Flow />
      </div>
      <div className="col-span-1 h-full">
        <Sidebar>
          <ForgotPasswordForm />
        </Sidebar>
      </div>
    </div>
  )
}
export default Password
