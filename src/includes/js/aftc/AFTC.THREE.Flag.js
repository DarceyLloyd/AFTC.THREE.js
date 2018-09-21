/*
 * Author: Darcey@AllForTheCode.co.uk
 * Version: 1.0
*/

// Ensure my lazy logger is available
if (!log) { function log(arg) { console.log(arg); } }

var THREEx = THREEx || {}

THREEx.Flag = function () {

    var me = this;

    var params = {

        width: 22,
        height: 17,
        segW: 22,
        segH: 17,
        color: 0xFF0000,
        material: null,
        wireFrame: true,
        speed: 5,
        rippleDepth: 1,
        waveLength: 4,
        waveDepth: 1,
        updateSpeed:20
    }

    // Process arguments
    if (arguments[0] && typeof (arguments[0]) == "object") {

        for (var key in arguments[0]) {
            if (arguments[0].hasOwnProperty(key)) {
                params[key] = arguments[0][key];
            }
        }
    }

    // Post procedding of params
    params.speed = params.speed / 10;
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

    //https://www.allforthecode.co.uk/old/aftc/forum/user/modules/forum/article.php?index=7&subindex=17&aid=241
    //https://www.allforthecode.co.uk/old/aftc/forum/user/modules/forum/article.php?index=7&subindex=17&aid=242


    function dist(dx, dy) {
        return Math.sqrt(dx * dx + dy * dy);
    }


    var mesh = new THREE.Mesh(geom, params.material);
    var t = 0;
    var info = document.getElementById("info");

    function animate() {
        //log("update");
        t += 0.1;
        var vz = 0,
            vt = 0;
        for (var i = 0; i < len; i++) {
            vt = (i / params.waveLength) + t;

            vz = Math.cos(vt) * params.waveDepth;
            vz = Math.sin(vz);

            var dx = mesh.geometry.vertices[i].x - params.segW / 2 * Math.sin(t / 2000);
            var dy = mesh.geometry.vertices[i].y - params.segH / 2 * Math.cos(t / 2000);
            vz = params.rippleDepth * Math.sin( (dist(dx, dy) / params.waveLength) + t * params.speed);
            //vc = Math.pow(2, vz*(i/50)); // Will result in a larger curve at one end
            //vx = mesh.geometry.vertices[i].x += Math.cos(vt) * 0.03;
            //vy = mesh.geometry.vertices[i].y += Math.cos(vt) * 0.03;
            mesh.geometry.vertices[i].z = vz;
        }
        mesh.geometry.verticesNeedUpdate = true;
    }
    var timer = setInterval(animate, params.updateSpeed);




    return mesh;

}