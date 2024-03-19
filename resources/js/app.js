import axios from 'axios';
import './bootstrap';

function getToken() {

    return new Promise((resolve, reject) => {

        try {
        var token = JSON.parse(localStorage.getItem('token'));

        var tokenData =  atob(token.access_token.split('.')[1]);
        } catch(e) {
            reject();
            return;
        }

        if(tokenData.exp < Math.floor(Date.now() / 1000)) {
            reject();
            return;
        }

        resolve(token.access_token);
    });
}

axios.interceptors.request.use((config) => new Promise((resolve, reject) => {
        var token = getToken().then((token) => {
            config.headers['Authorization'] = `Bearer ${JSON.parse(localStorage.getItem('token')).access_token}`;
            resolve(config);
        }).catch(() => {
            window.open('/auth', '_blank');
            reject();
        });    
}));


window.hello = async() => alert((await axios.get('/api/hello')).data);