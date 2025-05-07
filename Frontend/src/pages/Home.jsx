import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [keyword, setKeyword] = useState("");
  const [websites, setWebsites] = useState([]);
  const navigate = useNavigate();

  const toggleWebsite = (site) => {
    setWebsites((prev) =>
      prev.includes(site) ? prev.filter((s) => s !== site) : [...prev, site]
    );
  };

  const handleSearch = () => {
    if (keyword.trim()) {
      navigate("/search", { state: { keyword } });
    }
  };

  return (
    <div className="flex flex-col items-center mt-20">
      <input
        className="border p-2 w-96 rounded mb-4"
        type="text"
        placeholder="Search products..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2 rounded">
        Search
      </button>
    </div>
  );
};

export default Home;
