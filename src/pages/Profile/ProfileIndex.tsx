import { FC, SetStateAction, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import authStore from '../../stores/auth.store';
import Header from '../../components/ui/Header';
import { StatusCode } from '../../constants/errorConstants';
import { UserType } from '../../models/auth';
import * as API from '../../api/Api';
import Profile from './Profile';
import Loading from '../../components/ui/Loading';
import { Button } from 'react-bootstrap';
import { routes } from '../../constants/routesConstants';

const ProfileIndex: FC = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState<number>(0);

  const [apiError, setApiError] = useState('');
  const [showError, setShowError] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  //dobi user iz DB glede localni access_token
  const [user, setUser] = useState<UserType>({
    id: 0,
    firstName: undefined,
    lastName: undefined,
    email: '',
    image: undefined,
  });

  //dobi User data glede localni access_token
  const getUserData = async () => {
    const userData = await API.fetchUser();
    console.log('Fetching User Data:', userData);

    // Check if userData is not undefined
    if (userData !== undefined) {
      //ce userData vrnil unauthorized, izbrisi localni access_token
      if (userData.statusCode === StatusCode.UNAUTHORIZED) {
        //ce si ze na main pageu IN obstaja access_token, force refreshaj stran
        if (
          location.pathname === routes.HOME &&
          window.localStorage.getItem(`access_token`)
        ) {
          authStore.signout();
          navigate(routes.HOME, { state: window.location.reload() });
        }
        //vrni na main page
        else {
          //ce obstaja access_token, delete in vrni na root
          //(za ko userju potece access_token ko je nekje v aplikaciji (ki ni PUBLIC))
          if (authStore.user) {
            authStore.signout();
            navigate(routes.HOME);
          }
          //ce ni access_tokena, da lahko obiskuje PUBLIC page
          authStore.signout();
        }
      } else {
        setUser(userData);
      }
    }
  };

  //signout funkcionalnost kjer nastavimo user (v tem fileu) na null
  const signout = async () => {
    const response = await API.signout();
    if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
      setApiError(response.data.message);
      setShowError(true);
    } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
      setApiError(response.data.message);
      setShowError(true);
    } else {
      console.log('Signing out');
      authStore.signout();
      setUser({
        id: 0,
        firstName: undefined,
        lastName: undefined,
        email: '',
        image: undefined,
      });
      navigate(routes.HOME);
    }
  };

  const handleHeaderRef = (ref: HTMLDivElement | null) => {
    if (ref) {
      const height = ref.getBoundingClientRect().height;
      setHeaderHeight(height);
      console.log('Header height:', headerHeight);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      // dobi userja ob zagonu komponente
      await getUserData();
    };
    //fetchData function ter pocakaj da se getUserData izvede
    fetchData();
  }, []);

  //currentTab: 0=auctions, 1-bidding, 2-won
  const [currentTab, setCurrentTab] = useState(0);

  const handleButtonClick = (tabIndex: SetStateAction<number>) => {
    setCurrentTab(tabIndex);
  };

  return (
    <>
      <Header
        setRef={handleHeaderRef}
        user={user}
        refreshUserData={getUserData}
        signout={signout}
      />
      {/* tab buttoni za preklapljanje med returned Auctioni */}
      <div className="flex items-center justify-center w-full">
        {/* background med buttonoma */}
        <div className="flex items-center bg-white rounded-full p-1">
          <Button
            onClick={() => handleButtonClick(0)}
            // spremeni still glede na current page
            className={`rounded-full p-2 m-1 w-28 text-center
              ${
                currentTab === 0 ? 'bg-black text-white' : 'bg-white text-black'
              }`}
          >
            My auctions
          </Button>
          <Button
            onClick={() => handleButtonClick(1)}
            className={`rounded-full p-2 m-1 w-28 text-center
              ${
                currentTab === 1 ? 'bg-black text-white' : 'bg-white text-black'
              }`}
          >
            Bidding
          </Button>
          <Button
            onClick={() => handleButtonClick(2)}
            className={`rounded-full p-2 m-1 w-28 text-center
              ${
                currentTab === 2 ? 'bg-black text-white' : 'bg-white text-black'
              }`}
          >
            Won
          </Button>
        </div>
      </div>
      {headerHeight > 0 ? (
        <Profile
          headerHeight={headerHeight}
          user={user}
          currentTab={currentTab}
        />
      ) : (
        <Loading />
      )}
      {showError && (
        <ToastContainer className="" position="top-end">
          <Toast onClose={() => setShowError(false)} show={showError}>
            <Toast.Header>
              <strong className="me-auto text-red-500 text-md">Error</strong>
            </Toast.Header>
            <Toast.Body className="text-red-500 bg-light text-sm">
              {apiError}
            </Toast.Body>
          </Toast>
        </ToastContainer>
      )}
    </>
  );
};
export default ProfileIndex;
