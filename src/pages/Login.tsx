import Flow from '../components/ui/Flow';
import Sidebar from '../components/ui/Sidebar';
import LoginForm from '../components/user/LoginForm';
import { FC } from 'react';

//LOGIN PAGE
const Login: FC = () => {
  return (
    <div className="flex items-center justify-center grid grid-cols-3 gap-4 h-full">
      <div className="col-span-2 h-full">
        {/* levi del: Auction grid */}
        <Flow />
      </div>
      <div className="col-span-1 h-full">
        {/* desni del: Login forma */}
        <Sidebar>
          <LoginForm />
        </Sidebar>
      </div>
    </div>
  );
};
export default Login;
