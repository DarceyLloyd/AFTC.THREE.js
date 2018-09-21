var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');




// This is the build list for the example in index.html
var jsForIndex = [
    // './includes/js/jquery/jquery-1.12.4.min.js',
    //"./includes/js/gsap/TweenMax.min.js",
    //'./includes/js/misc/lodash.min.js',

    "./node_modules/aftc.js/src/debug.js",
    // "./node_modules/aftc.js/src/animation.js",
    "./node_modules/aftc.js/src/conversion.js",
    //"./node_modules/aftc.js/src/cookies.js",
    //"./node_modules/aftc.js/src/datetime.js",
    //"./node_modules/aftc.js/src/detection.js" ,
    //"./node_modules/aftc.js/src/dom.js",
    //"./node_modules/aftc.js/src/form.js",
    //"./node_modules/aftc.js/src/graphics.js",
    //"./node_modules/aftc.js/src/io.js",
    //"./node_modules/aftc.js/src/misc.js",
    //"./node_modules/aftc.js/src/string.js",
    //"./node_modules/aftc.js/src/validation.js",
    
    './includes/js/threejs/three.js',
    './includes/js/threejs/Detector.js',
    './includes/js/threejs/libs/stats.min.js',
    // './includes/js/threejs/libs/dat.gui.min.js',
    './includes/js/threejs/controls/OrbitControls.js',

    // './includes/js/threejs/shaders/CopyShader.js',
    // './includes/js/threejs/postprocessing/EffectComposer.js',
    // './includes/js/threejs/postprocessing/RenderPass.js',
    // './includes/js/threejs/postprocessing/ShaderPass.js',

    // './includes/js/aftc/aftc.preload.js',
    './includes/js/aftc/AFTC.THREE.js',
    //'./includes/js/aftc/scene01.js',
];

gulp.task('build-dev', function () {
    //gulp.src('includes/js/**/*.js')
    gulp.src(jsForIndex)
        .pipe(concat('app.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('includes/js/'));
});

gulp.task('watch-dev', function () {
    gulp.watch(jsFileList, ['build-dev']);
});






// This is the build list for AFTC.THREE.js
var AFTCThreeJSFiles = [
    './includes/js/aftc/aftc.three.js'
];

gulp.task('build', function () {
    gulp.src(AFTCThreeJSFiles)
        .pipe(concat('aftc.three.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('../dist/'));
});

gulp.task('watch-build', function () {
    gulp.watch(jsFileList, ['build']);
});







// I've left this in encase I ever want to start using sass/scss
// var sass = require('gulp-ruby-sass');
// var autoprefixer = require('gulp-autoprefixer');
// var minifyCss = require('gulp-minify-css');

// gulp.task('sass', function () {
//     gulp.src('src/sass/styles.scss')
//         .pipe(sass())
//         .pipe(autoprefixer())
//         .pipe(minifyCss())
//         .pipe(gulp.dest('dest'));
// });

// gulp.task('default', ['scripts', 'sass'], function () {
//     gulp.watch('src/js/**/*.js', ['scripts']);
//     gulp.watch('src/sass/**/*.{sass,scss}', ['sass']);
// });