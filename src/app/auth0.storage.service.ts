export class Auth0StorageService {
    store<T>(key: string, data: T) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    get<T>(key: string): T {
        return <T> JSON.parse(localStorage.getItem(key));
    }

    remove(key: string) {
        localStorage.removeItem(key);
    }
}
