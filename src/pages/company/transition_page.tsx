import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import LoadingPage from "../Loading_page";

export const RouteTransition = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (loading) {
    return <LoadingPage />;
  }

  return null;
};