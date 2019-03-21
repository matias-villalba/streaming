module.exports = {
  usingDatabase : ((process.env.STORAGE_TYPE || 'filesystem') === 'database'),

  videosDirectoryPath: (process.env.VIDEOS_DIRECTORY_PATH || './resources/'),
  databaseUrl: (process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017'),
  listeningPort: (process.env.LISTENING_PORT || 5000)
}