import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const checkLoginStatus = () => {
    const userInfo = localStorage.getItem("userInfo");
    const token = userInfo ? JSON.parse(userInfo).token : null;
    setIsLoggedIn(!!token);
  };

  useEffect(() => {
    checkLoginStatus();

    const storageListener = () => checkLoginStatus();
    const loginListener = () => checkLoginStatus(); 

    window.addEventListener("storage", storageListener);
    window.addEventListener("user-logged-in", loginListener);

    return () => {
      window.removeEventListener("storage", storageListener);
      window.removeEventListener("user-logged-in", loginListener);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-between p-4 shadow bg-white">
      <Link to="/" className="text-xl font-bold">🛒 PaisaBachao</Link>
      <div className="flex gap-4">
        <Link
          to="/wishlist"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
        >
          Wishlist
        </Link>

        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={handleLogin}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
