const baseAbsPath = __dirname + '/';
module.exports = {
  apps : [{
    name: "api",
    script: baseAbsPath + "api.js",
    exec_mode: "cluster_mode",
    watch: false,
    autorestart: false,
    instances: "max",
    out_file: baseAbsPath + "../logs/api.log", // Piping stdout.
    error_file: baseAbsPath + "../logs/api_err.log", // Piping stderr.
    merge_logs: true,
    log_date_format: "YYYY-MM-DD HH:mm Z",
    log_file: baseAbsPath + "../logs/api_merged.log", // Piping "stdout+stderr".
    env_development: {
      "NODE_ENV": "development",
    },
    env_test: {
      "TESTING": "true",
      "NODE_ENV": "development",
    },
    env_stress_test: {
      "TESTING": "true",
      "STRESS_TESTING": "true",
      "NODE_ENV": "development",
    },
    env_production : {
      "NODE_ENV": "production"
    }
  },
  {
      name: "doc",
      script: baseAbsPath + "doc.js",
      watch: false,
      autorestart: false,
      instances: 1,
      exec_mode: "cluster_mode",
      out_file: baseAbsPath + "../logs/doc.log", // Piping stdout.
      error_file: baseAbsPath + "../logs/doc_err.log", // Piping stderr.
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm Z",
      log_file: baseAbsPath + "../logs/doc_merged.log" // Piping "stdout+stderr".
    }]
}

