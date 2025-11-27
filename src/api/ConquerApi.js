import http from "./axios.js";

export const ConquerApi = {
  start(payload) {
    return http.post("/conquer/start", payload).then((res) => res.data);
  },

  end(payload) {
    return http.post("/conquer/end", payload).then((res) => res.data);
  }
};

export default ConquerApi;
