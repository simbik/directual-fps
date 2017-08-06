export default class LocalStorageManager {
  static setDirectualConfig(appId, appSecret, networkId) {
    localStorage.setItem('appId', JSON.stringify(appId));
    localStorage.setItem('appSecret', JSON.stringify(appSecret));
    localStorage.setItem('networkId', JSON.stringify(networkId));
  }

  static removeDirectualConfig() {
    localStorage.removeItem('appId');
    localStorage.removeItem('appSecret');
    localStorage.removeItem('networkId');
  }

  static getDirectualConfig() {
    const directualConfig = {
      appId: JSON.parse(localStorage.getItem('appId')),
      appSecret: JSON.parse(localStorage.getItem('appSecret')),
      networkId: JSON.parse(localStorage.getItem('networkId')),
    };
    return directualConfig;
  }

  static clearLocalStorage() {
    localStorage.clear();
  }
}
