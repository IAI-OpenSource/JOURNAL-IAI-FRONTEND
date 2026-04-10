/*import axios from 'axios';

const api = axios.create({
    baseURL : 'http://api.iai-journal.test:81',
    headers : {
        'Content-Type' : 'application/json',
    },

});


api.interceptors.request.use((config) =>  {
    const token = localStorage.getItem('access_token');
    if(token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;

})

export default api;*/
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,  // envoie les cookies
});

/*vu que j'utilise le cookie j'ai supp l'intercepteur qui ajoutait Authorization, mais j'ai
juste commenté la partie du haut juste pour tester chez moi avec */

export default api;