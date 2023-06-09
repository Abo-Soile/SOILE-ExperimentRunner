import axios from "axios"
axios.defaults.withCredentials = true;

axios.defaults.baseURL=import.meta.env.BACKENDDOMAIN ? "https://" + import.meta.env.BACKENDDOMAIN + ":" +  import.meta.env.BACKENDPORT : "https://localhost:8081";

console.log("Setting baseurl to:" + axios.defaults.baseURL);
// This probably needs to change and rather the certificates need to be set appropriately.
axios.defaults.rejectUnauthorized = false;
