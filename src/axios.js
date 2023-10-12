import axios from "axios";

export function setupAxios(env) {
  axios.defaults.withCredentials = true;

  const SERVER_URL = `${env.VITE_BACKENDDOMAIN}${
    env.VITE_FRONTENDPORT != undefined ? ":" + env.VITE_FRONTENDPORT : ""
  }`;

  axios.defaults.baseURL = env.VITE_BACKENDDOMAIN
    ? `${env.VITE_HTTPS === "true" ? "https://" : "http://"}${SERVER_URL}${
        env.VITE_BASE_URL ? env.VITE_BASE_URL : ""
      }/api`
    : "https://localhost:8081";

  // This probably needs to change and rather the certificates need to be set appropriately.
  axios.defaults.rejectUnauthorized = false;
}
