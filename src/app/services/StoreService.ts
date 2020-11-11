export class StoreService {
    static readonly key = 'todo list id';


    static save(data) {
        window.localStorage.setItem(this.key, JSON.stringify(data));
    }


    static load() {
        const value = window.localStorage.getItem(this.key);
        if (!value)
            return [];

        return JSON.parse(value);
    }
}
