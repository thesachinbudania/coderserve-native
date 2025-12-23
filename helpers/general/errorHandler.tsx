import { router } from 'expo-router';

export default function errorHandler(error: Error, redirect = true) {
    console.error(error)
    if (redirect) {
        router.replace("(freeRoutes)/error");
    }
}