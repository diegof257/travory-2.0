// conversation.js
const KEY = 'travory-conversation-id';

export const conversation = {
  get() {
    return localStorage.getItem(KEY);
  },

  create() {
    const id = crypto.randomUUID();
    localStorage.setItem(KEY, id);
    return id;
  },

  getOrCreate() {
    return this.get() || this.create();
  },

  clear() {
    localStorage.removeItem(KEY);
  }
};
