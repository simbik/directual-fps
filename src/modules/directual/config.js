import LocalStorageManager from '../../utils/LocalStorageManager';

const directualConfig = LocalStorageManager.getDirectualConfig();

const config = {
  BASE_URI: 'https://directual.com/',
  DATA_URI: 'good/api/v3',
  AUTH_URI: 'rest/v4/auth',
  APP_ID: directualConfig.appId, // '47ef71b0-9a6e-4ece-a35d-859d6ae6e2d4',
  APP_SECRET: directualConfig.appSecret, // 'LDmhYaKZHzJ',
  NETWORK_ID: directualConfig.networkId, // '1604',
};

export default config;

