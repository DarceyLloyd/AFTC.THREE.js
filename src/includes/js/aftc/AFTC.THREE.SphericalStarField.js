/*
 * Author: Darcey@AllForTheCode.co.uk
 * Version: 1.0
*/

// Ensure my lazy logger is available
if (!log) { function log(arg) { console.log(arg); } }

var THREEx = THREEx || {}

THREEx.SphericalStarField = function () {

    var me = this;

    var app,
        scene,
        rx = 0.01,
        ry = 0,
        rz = 0;

    // Process arguments
    if (arguments[0] && typeof (arguments[0]) == "object") {

        if (arguments[0].app) {
            // Access to DThree can be had via app but is not necessary: var app = arguments[0].app;
            // var scene = app.getScene();
            // var sceneParams = app.getSceneParams();
            app = arguments[0].app;
        }

        if (arguments[0].rx) { rx = parseFloat(arguments[0].rx); }
    }

    var assets = [
        'assets/textures/starfield_2b.png'
    ]

    var geometry = new THREE.SphereGeometry(90, 32, 32);
    var material = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture(assets[0]),
        side: THREE.BackSide
    });
    var mesh = new THREE.Mesh(geometry, material);
    //scene.add(mesh);


    // Alternate way
    /*
    var geometry = new THREE.SphereBufferGeometry( 500, 32, 16 );
    var material = new THREE.MeshBasicMaterial( { map: texture } )
    mesh.scale.x = -1;
    */
    

    return {
        mesh,
        renderFn: function (me) {
            if (mesh) {
                mesh.rotation.y += rx;
            }
        }
    };

}