import axios from "axios"

axios.defaults.withCredentials = true;
axios.defaults.baseURL="https://localhost:8081";
// This probably needs to change and rather the certificates need to be set appropriately.
axios.defaults.rejectUnauthorized = false;
