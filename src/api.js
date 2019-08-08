import axios from 'axios';

export default {
  async getToken() {
    const response = await axios.get(`${process.env.REACT_APP_SERVER_BASE}/token`);
    return response.data.token;
  },
};
