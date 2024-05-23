import { FC, useEffect, useState } from 'react';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Card from './Card';
import Loading from './Loading';
import { AuctionType } from '../../models/auction';
import { StatusCode } from '../../constants/errorConstants';
import * as API from '../../api/Api';
import { useLocation } from 'react-router-dom';
import { UserType } from '../../models/auth';

const Flow: FC = () => {
  //za error prikazovanje (Toast)
  const [apiError, setApiError] = useState('');
  const [showError, setShowError] = useState(false);

  //itemi (Auctioni) ki jih dobis iz db za prikaz
  const [auctions, setAuctions] = useState<AuctionType[]>([]);

  //page se se nalaga?
  const [loading, setLoading] = useState(true);

  const fetchAuctionsData = async () => {
    try {
      const response = await API.fetchAuctions(1);
      console.log(response);

      if (
        response.data?.statusCode === StatusCode.BAD_REQUEST ||
        response.data?.statusCode === StatusCode.FORBIDDEN ||
        response.data?.statusCode === StatusCode.UNAUTHORIZED
      ) {
        setApiError(response.data.message);
        setShowError(true);
      } else if (
        response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR
      ) {
        setApiError(response.data.message);
        setShowError(true);
      } else {
        // console.log("Response: ", response.data.data)
        setAuctions(response.data.data);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching auctions:', error);
      setShowError(true);
    }
  };

  //dobi data iz api ko se komponenta nalozi
  useEffect(() => {
    fetchAuctionsData();
  }, []); //funkcijo zazeni le ob zacetku

  //ce se se page loada
  if (loading) {
    return <Loading />;
  }

  //dummy user da posljemo v Card widget (ker ga dobi pri Propih)
  //vendar User ne obstaja, ker nismo logged in
  const dummyUser: UserType = {
    id: 0,
    firstName: undefined,
    lastName: undefined,
    email: '',
    image: undefined,
  };

  return (
    <>
      {/* justify, continer = center horizontal */}
      <div className="container mx-auto flex justify-center items-center h-screen">
        {/* ustvari grid kjer so elementi skupaj v centru */}
        <div className="grid grid-cols-2 gap-4">
          {/* izrisi 4 prvih Auctionov iz backenda,  vsak card posebej (da bodo pravilno postavljeni) */}
          {/* dodaj custom drop shadow gradient, rounded corners kot v Card widgetu, sicer ni pravilni color pri cornerjih */}
          {auctions[0] && (
            <div className="relative overflow-hidden rounded-2xl shadow-gradient">
              <Card
                item={auctions[0]}
                user={dummyUser}
                fetchAuctions={fetchAuctionsData}
              />
            </div>
          )}
          {auctions[1] && (
            <div className="relative overflow-hidden rounded-2xl shadow-gradient">
              <Card
                item={auctions[1]}
                user={dummyUser}
                fetchAuctions={fetchAuctionsData}
              />
            </div>
          )}
          {auctions[2] && (
            <div className="relative overflow-hidden rounded-2xl shadow-gradient">
              <Card
                item={auctions[2]}
                user={dummyUser}
                fetchAuctions={fetchAuctionsData}
              />
            </div>
          )}
          {auctions[3] && (
            <div className="relative overflow-hidden rounded-2xl shadow-gradient">
              <Card
                item={auctions[3]}
                user={dummyUser}
                fetchAuctions={fetchAuctionsData}
              />
            </div>
          )}
        </div>
      </div>
      {/* prikazi error iz backenda */}
      {showError && (
        <ToastContainer className="p-3" position="top-end">
          <Toast onClose={() => setShowError(false)} show={showError}>
            <Toast.Header>
              <strong className="me-auto text-red-500">Error</strong>
            </Toast.Header>
            <Toast.Body className="text-red-500 bg-light">
              {apiError}
            </Toast.Body>
          </Toast>
        </ToastContainer>
      )}
    </>
  );
};

export default Flow;
