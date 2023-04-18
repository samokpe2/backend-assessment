module.exports = {
  apps: [{
    name: 'api',
    script: 'dist/start.js',
    instances: 1, // runs 1 instance of application
    exec_mode: "cluster",
    env: { 'NODE_ENV': 'development' },
    env_production: { 'NODE_ENV': 'production' }
  },
  {
    name: 'worker',
    script: 'dist/start.js',
    instances: 1, // runs 1 instance of application
    exec_mode: "cluster",
    env: { 'NODE_ENV': 'development' },
    env_production: { 'NODE_ENV': 'production' },
  }],
};
