module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3001'],
      startServerCommand: 'npm run start',
      startServerReadyTimeout: 30000
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
};
