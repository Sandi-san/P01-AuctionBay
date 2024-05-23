import { FC, ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { routes } from '../../constants/routesConstants';

interface Props {
  children: ReactNode | ReactNode[];
}

//SIDEBAR ZA LOGIN/REGISTER PAGE
const Sidebar: FC<Props> = ({ children }) => {
  //za na katerem pageu (url) smo trenutno
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
          {location.pathname === routes.LOGIN && (
            <p>
              Don't have an account? <Link to="/signup" className='font-bold'>Sign Up</Link>
            </p>
          )}
          {location.pathname === routes.SIGNUP && (
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
