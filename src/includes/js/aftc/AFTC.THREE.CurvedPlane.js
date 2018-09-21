/*
 * Author: Darcey@AllForTheCode.co.uk
 * Version: 1.0
*/

// Ensure my lazy logger is available
if (!log) { function log(arg) { console.log(arg); } }

var THREEx = THREEx || {}

THREEx.CurvedPlane = function () {

    var me = this;

    var params = {

        width: 10,
        height: 10,
        segW: 4, // 10
        segH: 4, // 10
        curveFactor: 10, // 40
        color: 0xFF0000,
        material: null,
        wireFrame: true,
    }

    // Process arguments
    if (arguments[0] && typeof (arguments[0]) == "object") {

        for (var key in arguments[0]) {
            if (arguments[0].hasOwnProperty(key)) {
                params[key] = arguments[0][key];
            }
        }
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    // Main
    if (!params.material || params.material == undefined) {
        params.material = new THREE.MeshLambertMaterial({
            color: params.color,
            transparent: false,
            wireframe: params.wireFrame,
            side: THREE.DoubleSide
        });
    }

    var geom = new THREE.PlaneGeometry(params.width, params.height, params.segW, params.segH);

    var len = geom.vertices.length;
    /*
    var vz = 0;
    for (var i = 0; i < len; i++) {
        vz = Math.pow(2, i / params.curveFactor);
        vz = Math.sin(i / 10);
        //log(vz);
        geom.vertices[i].z = vz;
    }
    geom.center();    
    var mesh = new THREE.Mesh(geom, params.material);
    var t = 0;
    //mesh.doubleSided = true;
    //mesh.rotation.y = Math.PI/2-0.5;
    //mesh.position.z = -5;
    */

    //https://www.allforthecode.co.uk/old/aftc/forum/user/modules/forum/article.php?index=7&subindex=17&aid=241
    //


    function dist(dx, dy) {
        return Math.sqrt(dx * dx + dy * dy);
    }


    var mesh = new THREE.Mesh(geom, params.material);
    var t = 0;
    var info = document.getElementById("info");

    var distanceBetweenWaves = 30;
    var waveDepth = 0.5;

    var nAnimSpeed = 1;
    var nAnimHeight = 1;

    function animate() {
        //log("update");
        t += 0.1;
        var vz = 0,
            vt = 0;
        for (var i = 0; i < len; i++) {
            vt = (i / distanceBetweenWaves) + t;

            vz = Math.cos(vt) * waveDepth;
            vz = Math.sin(vz);

            var dx = mesh.geometry.vertices[i].x - params.segW / 2 * Math.sin(t / 2000);
            var dy = mesh.geometry.vertices[i].y - params.segH / 2 * Math.cos(t / 2000)
            vz = nAnimHeight * Math.sin( (dist(dx, dy) / 3) + t * nAnimSpeed)
            //vc = Math.pow(2, vz*(i/50)); // Will result in a larger curve at one end
            //vx = mesh.geometry.vertices[i].x += Math.cos(vt) * 0.03;
            //vy = mesh.geometry.vertices[i].y += Math.cos(vt) * 0.03;
            mesh.geometry.vertices[i].z = vz;

            if (i == 0) {
                //log(vz);
                info.innerHTML = "vz = " + vz;
            }
        }
        mesh.geometry.verticesNeedUpdate = true;
    }
    var timer = setInterval(animate, 30);




    return mesh;

}