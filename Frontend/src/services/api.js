import axios from "axios";

const instance = axios.create({
  baseURL: "https://price-comparison-site-nxy2.onrender.com/api", 
  withCredentials: true,
});

export default instance;
