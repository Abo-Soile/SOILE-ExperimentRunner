import axios from "axios";

export function setupAxios(env) {
  axios.defaults.withCredentials = true;

  const SERVER_URL = `${env.VITE_BACKENDDOMAIN}${
    env.VITE_BACKENDPORT != "" ? ":" + env.VITE_BACKENDPORT : ""
  }`;

  axios.defaults.baseURL = env.VITE_BACKENDDOMAIN
    ? `${SERVER_URL}${env.VITE_BASE_URL ? env.VITE_BASE_URL : ""}`
    : "https://localhost:8081";

  console.error("Setting baseurl to:" + axios.defaults.baseURL);
  // This probably needs to change and rather the certificates need to be set appropriately.
  axios.defaults.rejectUnauthorized = false;
}
