import axios from 'axios';

const instance = axios.create({
    baseURL : 'https://react-burger-builder-dec26.firebaseio.com/'
});

export default instance;