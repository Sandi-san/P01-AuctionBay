import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const onDefault = () => {
  document.title = 'AuctionBay';
  document.body.id = '';
};
const onHome = () => {
  document.title = 'AuctionBay';
  document.body.id = 'home-page';
};
const onAuctions = () => {
  document.title = 'AuctionBay - Auctions';
  document.body.id = 'auctions-page';
};
const onProfile = () => {
  document.title = 'AuctionBay - Profile';
  document.body.id = 'profile-page';
};
const onLogin = () => {
  document.title = 'AuctionBay - Login';
  document.body.id = 'login-page';
};
const onSignup = () => {
  document.title = 'AuctionBay - Signup';
  document.body.id = 'signup-page';
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const callbacks: any = {
  '/': [onHome],
  '/auction': [onAuctions],
  '/auctions': [onAuctions],
  '/profile': [onProfile],
  '/login': [onLogin],
  '/signup': [onSignup],
  '*': [onDefault],
};

export const addPageIdentification = (_case: string, fn: () => void) => {
  callbacks[_case] = callbacks[_case] || [];
  callbacks[_case].push(fn);
};

export const usePageIdentification = () => {
  const location = useLocation();

  const customSwitch = (value: string) => {
    if (callbacks[value]) {
      callbacks[value].forEach((fn: () => void) => {
        fn();
      });
    } else {
      onDefault();
    }
  };

  useEffect(() => {
    if (location.pathname) customSwitch(location.pathname);
  }, [location.pathname]);
};
