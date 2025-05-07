import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../services/api";
import toast from 'react-hot-toast';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  const fetchWishlist = async () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    if (!userInfo) {
      toast.error('Please log in to view your wishlist');
      return navigate('/login');
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const res = await api.get('/wishlist', config);
      console.log(res.data);
      setWishlist(res.data.products); // Assuming products are in the `products` array
    } catch (err) {
      console.error('Error fetching wishlist', err);
      toast.error('Failed to load wishlist');
    }
  };

  // Handle removing a product from the wishlist
  const handleRemove = async (productId) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    if (!userInfo) {
      toast.error('Please log in to remove items');
      return navigate('/login');
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await api.delete(`/wishlist/${productId}`, config);
      setWishlist(wishlist.filter((item) => item.productId !== productId));
      toast.success('Removed from wishlist');
    } catch (err) {
      console.error('Failed to remove item', err);
      toast.error('Could not remove item');
    }
  };

  // Handle navigating to the product page
  const handleNavigateToProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Wishlist</h1>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {wishlist.length > 0 ? (
          wishlist.map((item) => (
            <div
              key={item.productId}
              className="bg-white shadow-md p-4 rounded-lg "

            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-contain mb-4"
              />
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <p className="text-gray-600">{item.description}</p>
              <p className="text-blue-600 font-bold mt-2">₹{item.price}</p>
              <p className="text-sm text-gray-400 mt-1">
                {Array.isArray(item.sources) && item.sources.length > 0 ? (
                  item.sources.map((source) => {
                    const url = source.source_url.startsWith('http')
                      ? source.source_url
                      : `http://${source.source_url}`;
                    return (
                      <div key={source.source_url} className="block mb-2">
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center space-x-2"
                        >
                          <img
                            src={source.source_logo}
                            alt={source.source_name}
                            className="w-8 h-8"
                          />
                          <span className="font-medium">{source.source_name}</span>
                        </a>
                        <div className="ml-10 text-sm text-gray-700">
                          <p>Price: ₹{source.price}</p>
                          {source.reviews_count && <p>{source.reviews_count} reviews</p>}
                          {source.rating && (
                            <p>
                              Rating: ⭐ {source.rating}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500">No sources available.</p>
                )}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the product page navigation
                  handleRemove(item.productId);
                }}
                className="mt-4 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
              >
                Remove from Wishlist
              </button>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">
            Your wishlist is empty.
          </p>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
