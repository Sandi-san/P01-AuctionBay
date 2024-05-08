import Sidebar from '../components/ui/Sidebar'
import RegisterForm from '../components/user/RegisterForm'
import { FC } from 'react'

const Register: FC = () => {
  return (
    <Sidebar>
      <RegisterForm />
    </Sidebar>
  )
}
export default Register
