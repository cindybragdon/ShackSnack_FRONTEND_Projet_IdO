import { useSegments, useLocalSearchParams } from 'expo-router';

export function useCurrentDeepLink() {
    // Récupère les segments de la route actuelle
    const segments = useSegments(); // Ex: ["user", "profil"] ou ["auth", "signin"]
    console.log(segments);


    // Récupère les paramètres de recherche (query)
    const params = useLocalSearchParams(); // Ex: { id: "123", foo: "bar" }
    console.log(params);

    // Construit le chemin de base
    const basePath = '/' + segments.join('/');

    // Construit la chaîne de query si nécessaire
    const queryString = new URLSearchParams(params).toString();
    const fullPath = queryString ? `${basePath}?${queryString}` : basePath;

  return fullPath;
}
