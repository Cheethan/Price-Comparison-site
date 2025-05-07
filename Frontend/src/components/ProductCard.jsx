import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${product.title}`, { state: product });
  };

  return (
    <div
      onClick={handleClick}
      className="border p-4 rounded cursor-pointer hover:shadow"
    >
      <img
        src={product.image}
        alt={product.title}
        className="h-40 w-full object-contain mb-2"
      />
      <h3 className="text-lg font-semibold">{product.title}</h3>
      <p className="text-blue-600">₹{product.price}</p>

      {/* Display all sources */}
      <div className="space-y-2 mt-2">
        {product.sources.map((source, index) => (
          <div key={index} className="flex items-start space-x-2">
            <img
              src={source.source_logo}
              alt={source.source_name}
              className="h-6 w-6 mt-1"
            />
            <div>
              <p className="text-sm text-gray-500">{source.source_name}</p>
              <p className="text-sm text-gray-400">{source.reviews_count} reviews</p>
              <p className="text-sm text-gray-500">Price: ₹{source.price}</p>
              <a
                href={`https://${source.source_url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 underline"
                onClick={(e) => e.stopPropagation()} 
              >
                Visit {source.source_name}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCard;
