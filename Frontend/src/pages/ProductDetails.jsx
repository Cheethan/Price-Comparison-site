import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const ProductDetails = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const [product, setProduct] = useState(state || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!product) {
      api.get(`/products/${id}`)
        .then((res) => setProduct(res.data))
        .catch(console.error);
    }
  }, [id, product]);

  const handleAddToWishlist = async () => {
    if (!product) {
      return toast.error("Product details are missing!");
    }
  
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const token = userInfo?.token;
  
    if (!token) {
      return toast.error("Please login to add items to wishlist.");
    }
  
    try {
      setLoading(true);
      const { title, price, description, image, manufacturer, rating, sources } = product;
  
      await api.post(
        "/wishlist",
        {
          title,
          price,
          description,
          image,
          manufacturer,
          rating,
          sources,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Added to wishlist!");
    } catch (err) {
      console.error(err);
      toast.error("Product already in wishlist");
    } finally {
      setLoading(false);
    }
  };

  if (!product) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <img
        src={product.image}
        alt={product.title}
        className="h-64 w-full object-contain mb-4"
      />
      <h2 className="text-2xl font-bold mb-2">{product.title}</h2>
      <p className="text-lg text-blue-600 mb-2">Base Price: ₹{product.price}</p>

      {product.description && (
        <p className="text-sm text-gray-700 mb-4">
          <strong>Description:</strong> {product.description}
        </p>
      )}
      {product.manufacturer && (
        <p className="text-sm text-gray-600 mb-2">
          <strong>Manufacturer:</strong> {product.manufacturer}
        </p>
      )}
      {product.rating && (
        <p className="text-sm text-yellow-600 mb-2">
          <strong>Rating:</strong> ⭐ {product.rating}
        </p>
      )}
      {product.availability && (
        <p className="text-sm text-green-600 mb-2">
          <strong>Availability:</strong> {product.availability}
        </p>
      )}

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-3">Available On:</h3>
        <div className="space-y-4">
          {product.sources?.map((source, index) => (
            <div
              key={index}
              className="flex items-start space-x-4 border p-2 rounded"
            >
              <img
                src={source.source_logo}
                alt={source.source_name}
                className="h-8 w-8 mt-1"
              />
              <div>
                <p className="text-sm font-medium">{source.source_name}</p>
                <p className="text-sm text-gray-400">
                  {source.reviews_count} reviews
                </p>
                <p className="text-sm text-gray-700">Price: ₹{source.price}</p>
                <a
                  href={`https://${source.source_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 underline"
                >
                  Visit {source.source_name}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleAddToWishlist}
        disabled={loading}
        className="mt-6 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700 disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add to Wishlist"}
      </button>
    </div>
  );
};

export default ProductDetails;
