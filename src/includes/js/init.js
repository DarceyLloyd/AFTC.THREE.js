/*
 * Author: Darcey@AllForTheCode.co.uk
 * Version: 1.0.0
 * 
 * NOTE: aftc.preload.js is src with no requirements
 * NOTE: aftc.preload.min.js is dist which includes jquery
*/

// Ensure some of my standard functions are available
if (!log) { function log(arg) { if (console) { console.log(arg); } } } // My lazy logger



// Var defs
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
var preloader,
    preloaderBar;
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function preloaderProgress(p) {
    var maxW = 100;
    var step = maxW / 100;
    var w = p * step;
    $("#preloader .bar").css("width", w + "%");
    $("#preloader .message").html("Loaded " + p + "%");
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function preloaderComplete() {
    $("#preloader").fadeOut(function(){
        buildScene();
    });
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -






// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
$(document).ready(function () {
    log("Darcey@AllForTheCode.co.uk - Developer Examples");


    /* Process flow:
     *  1. Setup the preloader
     *  2. Start preloading and deal with the onProgress event
     *  3. Preloading complete
     *  4. Build scene
    */

    // The Preloader bar
    preloaderBar = document.getElementsByClassName("preloaderBar")[0];

    // Setup & Configure the preloader
    preloader = new AFTC.Preloader({
        onComplete: preloaderComplete,
        onProgress: preloaderProgress
    });

    // Add the files you wish to preload
    preloader.add({ url: "includes/js/app.min.js" });

    preloader.add({ url: "assets/textures/stars/starfield_1.png" });
    preloader.add({ url: "assets/textures/stars/starfield_2a.jpg" });
    preloader.add({ url: "assets/textures/stars/starfield_2b.png" });

    preloader.add({ url: "assets/textures/cubemaps/nebula_03/neb_nx.jpg" });
    preloader.add({ url: "assets/textures/cubemaps/nebula_03/neb_px.jpg" });
    preloader.add({ url: "assets/textures/cubemaps/nebula_03/neb_ny.jpg" });
    preloader.add({ url: "assets/textures/cubemaps/nebula_03/neb_py.jpg" });
    preloader.add({ url: "assets/textures/cubemaps/nebula_03/neb_nz.jpg" });
    preloader.add({ url: "assets/textures/cubemaps/nebula_03/neb_pz.jpg" });

    // Start the preloader
    preloader.start();
});
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -