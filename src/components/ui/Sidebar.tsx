import { FC, ReactNode } from 'react';
import Header from './Header';
import { Link, useLocation } from 'react-router-dom';

interface Props {
  children: ReactNode | ReactNode[];
}

const Sidebar: FC<Props> = ({ children }) => {
  const location = useLocation();

  return (
    //container da lahko vidimo rounded cornerje brez da extendamo vsebino
    <div className="h-screen p-2">
      <div className="layout-container container-xxl p-4 flex flex-col justify-between h-full bg-white rounded-lg">
        {/* slika logo center zgoraj */}
        <div className="flex items-center justify-center mb-4">
          <Link to="/">
            <img src="/images/logo.png" alt="Logo" className="h-12 w-12 rounded-full mr-2" />
          </Link>
        </div>
        {/* flex-1 = zapolni cel prostor (text bo na dnu containerja) */}
        <div className="flex-1">
          {children}
        </div>
        {/* izris text za link do logi/register glede current page */}
        <div className="text-center">
          {location.pathname === '/login' && (
            <p>
              Don't have an account? <Link to="/signup" className='font-bold'>Sign Up</Link>
            </p>
          )}
          {location.pathname === '/signup' && (
            <p>
              Already have an account? <Link to="/login" className='font-bold'>Login</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
