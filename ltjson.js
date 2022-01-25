class MXCache {
  constructor(isLoacl = true) {
    this.storage = isLoacl ? localStorage : sessionStorage;
  }

  setCache(key, value) {
    if (value) {
      this.storage.setItem(key, JSON.stringify(value));
    }
  }
  getCache(key) {
    let value = this.storage.getItem(key);
    if (value) {
      return JSON.parse(value);
    }
  }
  deleteCache(key) {
    this.storage.removeItem(key);
  }
  clearCache() {
    this.storage.clear();
  }
  key(index) {
    return this.storage.key(index);
  }
  length() {
    return this.storage.length();
  }
}

const localCache = new MXCache();
const sessionCache = new MXCache(false);

export {
  localCache,
  sessionCache
}