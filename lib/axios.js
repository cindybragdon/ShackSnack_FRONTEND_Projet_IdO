import axios from 'axios';
import { IP_BACKEND } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Création d'une instance Axios avec une URL de base
export const api = axios.create({
    baseURL: IP_BACKEND
});


// Fonction pour enregistrer le JWT dans AsyncStorage

export async function setToken(token) {
    try {
        console.log(token?.toString())
        if (token) {
            await AsyncStorage.setItem('jwt', token);
        } else {
            console.log("Impossible de définir un token null ou undefined");
        }
    } catch (error) {
        console.error('Erreur lors de lenregistrement du token :', error);
    }
}

// Fonction pour récupérer le JWT depuis AsyncStorage
export async function getToken() {
    try {
        return await AsyncStorage.getItem('jwt');
    } catch (error) {
        console.error('Erreur lors de la récupération du token :', error);
        return null;
    }
}



// Fonction pour définir le token globalement dans Axios
export async function setAxiosToken() {
    const token = await getToken();
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        console.log('Token ajouté aux headers:', token);
    }
}

// Appliquer le token à toutes les requêtes dès le démarrage
setAxiosToken();

// Intercepteur pour s'assurer que chaque requête a le bon token
api.interceptors.request.use(
    async (config) => {
        const token = await getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);



// Fonction pour enregistrer le JWT dans AsyncStorage
export async function setUser(user) {
    try {
        if (user) {
            const userString = JSON.stringify(user);
            await AsyncStorage.setItem('user', userString);
        } else {
            throw new Error('Impossible de définir un user null ou undefined');
        }
    } catch (error) {
        console.error("Erreur lors de l'enregistrement du user :", error);
    }
}

// Fonction pour récupérer le JWT depuis AsyncStorage
export async function getUser() {
    try {
        const user = await AsyncStorage.getItem('user');
        return JSON.parse(user);
    } catch (error) {
        console.error('Erreur lors de la récupération du user :', error);
        return null;
    }
}



// Fonction pour enregistrer le JWT dans AsyncStorage
export async function setAnimals(user) {
    try {
        if (user) {
            const userString = JSON.stringify(user);
            await AsyncStorage.setItem('animals', userString);
        } else {
            throw new Error('Impossible de définir des animaux null ou undefined');
        }
    } catch (error) {
        console.error("Erreur lors de l'enregistrement du des animaux du user :", error);
    }
}

// Fonction pour récupérer le JWT depuis AsyncStorage
export async function getAnimals() {
    try {
        const user = await AsyncStorage.getItem('animals');
        return JSON.parse(user);
    } catch (error) {
        console.error('Erreur lors de la récupération des animaux du user :', error);
        return null;
    }
}
// Ajouter un intercepteur pour inclure automatiquement le JWT dans les en-têtes des requêtes
api.interceptors.request.use(
    async (config) => {
        const token = await getToken();
        console.log('Retrieved Token:', token); 
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.request.use((config) => {
    console.log("Request:", config);
    return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use((response) => {
    console.log("Response:", response);
    return response;
}, (error) => {
    console.error("Axios Error:", error);
    return Promise.reject(error);
});


// Fonction pour se connecter
export async function signIn(email, password) {
    try {
        const signInData = { email, password };
        const userAuth = await api.post(`/users/login`, signInData);

        console.log("DAAR : ")
        console.log(userAuth.data);
        if (userAuth.status !== 200) throw new Error('Échec de la connexion');
        await setToken(userAuth.data.token);
        await setUser(userAuth.data.user);
        await setAnimals(userAuth.data.animals);

        await setAxiosToken();
        return userAuth.data;
    } catch (error) {
        console.error('Erreur lors de la connexion :', error);
        throw new Error(error.message);
    }
}

// Fonction pour créer un compte
export async function signUp(firstname, lastname, username, email, password) {
    try {
        const signUpData = { firstname, lastname, username, email, password, role:"User" };
        const userAuth = await api.post(`/users/createAccount`, signUpData);

        if (userAuth.status !== 201) throw new Error('Échec de l\'inscription');
        await setToken(userAuth.data.token);
        await setUser(userAuth.data.user);
        await setAnimals(userAuth.data.animals);
        
        await setAxiosToken();

        return userAuth.data;
    } catch (error) {
        console.error('Erreur lors de l\'inscription :', error);
        throw new Error(error.message);
    }
}

// Fonction pour get les logs de nourrissage
export async function getAllFeedingLogsOfUser(id) {
    try {
        const userAuth = await api.get(`/feedingLogs/user/${id}`);

        console.log(userAuth);
        if (userAuth.status !== 200) throw new Error('Échec de get les feeding logs du user');
        await setToken(userAuth.data.token);
        return userAuth.data;
    } catch (error) {
        console.error('Erreur lors de l\'inscription :', error);
        throw new Error(error.message);
    }
}