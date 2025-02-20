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

export async function getFeedingLogsByAnimalId(animalId) {
    try {
        const userAuth = await api.get(`/feedingLogs/animal/${animalId}`);

        console.log(userAuth);
        if (userAuth.status !== 200) throw new Error('Échec de get les feeding logs du user');
        await setToken(userAuth.data.token);
        return userAuth.data;
    } catch (error) {
        console.error('Erreur lors de l\'inscription :', error);
        throw new Error(error.message);
    }
}

export async function createFeedingLog(animalId, deviceId, feeding_food_type, feeding_quantity) {
    try {

        const user = await getUser();
        const userid = user.id;
        const now = new Date();
        const feedingLogData = { userid, animalId, deviceId, now, feeding_food_type, feeding_quantity };
        const userAuth = await api.post(`/feedingLogs`, feedingLogData);

        if (userAuth.status !== 201) throw new Error('Échec de l\'creation de feedingLog');

        return userAuth.data;
    } catch (error) {
        console.error('Échec de l\'creation de feedingLog :', error);
        throw new Error(error.message);
    }
}

///// *** FONCTIONS POUR LES USER ROUTES *** \\\\\
// Fonction pour get tous les users
export async function getAllUsers() {
    try {
        const userAuth = await api.get(`/users`);

        if (userAuth.status !== 200) throw new Error('Échec de get les users');
        return userAuth.data;
    } catch (error) {
        console.error('Erreur lors du get des users :', error);
        throw new Error(error.message);
    }
}

// Function pour get un user by id
export async function getUserById(userId) {
    try {
        const userAuth = await api.get(`/users/${userId}`);
        
        if (userAuth.status !== 200) throw new Error('Échec du get user par id');
        return userAuth.data;
    } catch (error) {
        console.error('Erreur lors du get du user par id :', error);
        throw new Error(error.message);
    }
}

// Fonction pour create un user en tant qu'admin
export async function createUser(firstname, lastname, username, email, password) {
    try {
        const signUpData = { firstname, lastname, username, email, password, role:"User" };
        const userAuth = await api.post(`/users`, signUpData);

        if (userAuth.status !== 201) throw new Error('Échec de la creation du user');
        
    
        await setAxiosToken();

        return userAuth.data;
    } catch (error) {
        console.error('Erreur lors de la creation du user :', error);
        throw new Error(error.message);
    }
}

// Fonction pour updater les informations du user par id
export async function updateUser(userId, newUsername, newFirstName, newLastName, newEmail) {
    try {
        console.log("Updating username for userId:", userId, "with new username:", newUsername);
        
        const response = await api.put(`/users/${userId}`, 
            {username: newUsername, firstname: newFirstName, lastname: newLastName, email: newEmail}
        );

        if (response.status !== 200) {
            throw new Error('Échec de la mise à jour du nom d\'utilisateur');
        }

        console.log("Successfully updated username:", response.data);
        return response.data;

    } catch (error) {
        console.error('Erreur lors de la mise à jour du nom d\'utilisateur :', error.response ? error.response.data : error.message);
        throw new Error(error.response ? error.response.data.message : error.message);
    }
}

// Fonction pour delete un user by id
export async function deleteUserById(userId) {
    try {
        console.log("Deleting user with userId  :", userId);
        
        const response = await api.delete(`/users/${userId}`);

        if (response.status !== 204) {
            throw new Error('Échec de la suppression du user');
        }

        console.log("Successfully deleted user with id:", userId);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la suppression de lutilisateur :', error.response ? error.response.data : error.message);
        throw new Error(error.response ? error.response.data.message : error.message);
    }
}


///// *** FONCTIONS POUR LES SUBDOCUMENTS ROUTES *** \\\\\
// Fonction pour get tous les sous documents d'un user
export async function getAllSubdocuments(userId, subDocName) {
    try {
        const userAuth = await api.get(`/users/${userId}/${subDocName}`);

        if (userAuth.status !== 200) throw new Error('Échec de get des subDoc');
        return userAuth.data;
    } catch (error) {
        console.error('Erreur lors du get des subDoc :', error);
        throw new Error(error.message);
    }
}

// Fonction pour get tous les sous documents d'un user by id
export async function getSubdocumentById(userId, subDocName, subDocId) {
    try {
        const response = await api.get(`/users/${userId}/${subDocName}/${subDocId}`);
        
        if (response.status !== 200) throw new Error("Échec du get du sous-document");
        
        return response.data;
    } catch (error) {
        console.error("Erreur lors du get du sous-document :", error.response ? error.response.data : error.message);
        throw new Error(error.response ? error.response.data.message : error.message);
    }
}

// Fonction pour creer un sous documents d'un user by idUser
export async function createSubdocument(userId, subDocName) {
    try {
        const userAuth = await api.post(`/users/${userId}/${subDocName}`);

        if (userAuth.status !== 201) throw new Error('Échec de la creation du sous document');
        
    
        await setAxiosToken();

        return userAuth.data;
    } catch (error) {
        console.error('Erreur lors de la creation du sous document :', error);
        throw new Error(error.message);
    }
}

// Fonction pour update un sous documents d'un user by idUser idSubDoc
export async function updateSubdocument(userId, subDocName, subDocId, updatedData) {
    try {
        const response = await api.put(`/users/${userId}/${subDocName}/${subDocId}`, updatedData);

        if (response.status !== 200) {
            throw new Error("Échec de la mise à jour du sous-document");
        }

        return response.data;
    } catch (error) {
        console.error("Erreur lors de la mise à jour du sous-document :", error.response ? error.response.data : error.message);
        throw new Error(error.response ? error.response.data.message : error.message);
    }
}

// Fonction pour delete un sous documents d'un user by idUser idSubDoc
export async function deleteSubdocument(userId, subDocName, subDocId) {
    try {
        const response = await api.delete(`/users/${userId}/${subDocName}/${subDocId}`);

        if (response.status !== 204) { // 204 = No Content (réponse standard pour une suppression réussie)
            throw new Error("Échec de la suppression du sous-document");
        }

        return { message: "Sous-document supprimé avec succès" };
    } catch (error) {
        console.error("Erreur lors de la suppression du sous-document :", error.response ? error.response.data : error.message);
        throw new Error(error.response ? error.response.data.message : error.message);
    }
}
