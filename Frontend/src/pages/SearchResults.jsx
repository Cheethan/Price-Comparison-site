import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api"
import ProductCard from "../components/ProductCard";
import Home from "./Home";

const SearchResults = () => {

  const { state } = useLocation();
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!state) return navigate("/");

    api.post("/products/search", state)
      .then((res) => setResults(res.data))
      .catch(console.error);
  }, [state, navigate]);  

  return (
    <>
    <div><Home/></div>
    <div className="p-4">
      <h2 className="text-lg mb-4">Search Results</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {results.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
    </>
  );
};

export default SearchResults;
