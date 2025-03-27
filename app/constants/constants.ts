const BASE_URL = "/api/auth";

const API_ROUTES = {
  USER_MANAGEMENT: {
    SIGNUP: `${BASE_URL}/signup`,
    RESET_PASSWORD: `${BASE_URL}/user/password`,
  },
  AUTH_LOGIN: {
    LOGIN: `${BASE_URL}/login`,
  },
  
};

export { BASE_URL, API_ROUTES };
export default API_ROUTES;
