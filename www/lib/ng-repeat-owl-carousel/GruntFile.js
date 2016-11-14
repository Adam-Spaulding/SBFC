/**
 * Created by mzaferyahsi on 18/02/15.
 */
module.exports = function(grunt) {

    grunt.initConfig({
        copy : {
            main : {
                files : [
                    {expand:true, flatten:true, src: ['./src/*.js'], dest:'./dist', filter:'isFile'},
                    {expand:true, flatten:true, src: ['./src/*.map'], dest:'./dist', filter:'isFile'}
                ]

            }
        },
        uglify: {
            my_target: {
                files: {
                    './dist/ngRepeatOwlCarousel.min.js': ['./src/ngRepeatOwlCarousel.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['copy', 'uglify']);

};