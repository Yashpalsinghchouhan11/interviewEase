import { useSelector, useDispatch } from "react-redux";
import { isAuthenticated, logOut } from "../Features/userSlice";
import { useEffect } from "react";

const AuthWatcher = () => {
  const dispatch = useDispatch();
  const authenticated = useSelector(isAuthenticated);

  useEffect(() => {
    if (!authenticated) {
      // Automatically log out if the token is invalid
      dispatch(logOut());
    }
  }, [authenticated, dispatch]);

  return null; // This component doesn't render anything
};

export default AuthWatcher;
