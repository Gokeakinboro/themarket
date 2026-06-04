
module.exports = {
  apps: [
    {
      name: "themarket",
      script: "node_modules/.bin/next",
      args: "start",
      cwd: "/opt/themarket",
      instances: 2,
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 4000,
      },
      error_file: "/var/log/themarket-error.log",
      out_file: "/var/log/themarket-out.log",
      merge_logs: true,
      max_memory_restart: "500M",
    },
  ],
}
