// This checks if the app is running locally or on Netlify
const API_URL = window.location.hostname === "localhost" 
    ? "http://localhost:10000" 
    : "https://symptom-analyzer-backend1.onrender.com";

export default API_URL;
