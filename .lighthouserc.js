module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3001'],
      startServerCommand: 'npm run start -- -p 3001',
      startServerReadyTimeout: 60000
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
};
