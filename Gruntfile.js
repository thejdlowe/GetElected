module.exports = function(grunt) {
	grunt.initConfig({
		pkg:	grunt.file.readJSON("package.json"),
		banner: "/*\n" +
			"<%=pkg.name %> - v. <%=pkg.version %>\n" + 
			"Copyright (c) <%= grunt.template.today('yyyy') %>\n" +
			"Last Compiled <%= grunt.template.today('yyyy-mm-dd HH:MM') %>\n*/",
		encase: {
			develop: {
				separator: "",
				environment: "browser",
				useStrict:	false,
				src:	"temp.js",
				banner: '<%= banner %>',
				exports: [],
				dest:	"game.js"
			}
		}, 
		uglify: {
			develop: {
				files: {
					"temp.js": ["src/*.js"]
				}
			}
		}
	});
	grunt.loadNpmTasks('grunt-encase');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-version')
	grunt.loadNpmTasks('grunt-push-release');
	
	grunt.registerTask("default", ["uglify", "encase"]);
};