module.exports = {
	apps: [
		{
			name: "b-tresEnRaya",
			script: "npm -- start",
			log_date_format: "DD/MM/YYYY HH:mm:ss Z",
			
			instances: 1,
			exec_mode: "fork",
			watch: true,
			ignore_watch: ["node_modules", ".github", ".*log"],
			
			env_production: {
				NODE_ENV: "production",
				TZ: 'Europe/Madrid'
			},
			
		}
	]
}
