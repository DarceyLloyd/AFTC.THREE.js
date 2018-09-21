/*
 * Author: Darcey@AllForTheCode.co.uk
 * Version: 1.0
*/

// Ensure my lazy logger is available
if (!log) { function log(arg) { console.log(arg); } }

var THREEx = THREEx || {}

THREEx.RoundedGlowPlane = function () {

    var me = this;

    var params = {
        color: 0x00FFFF,
        width: 10,
        height: 10,
        glowDetail: 6,
        glowSize: 5,
        cornerRadius:2
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


    var createRoundedPlane = function (x, y, width, height, radius, material) {
        var shape = new THREE.Shape();
        shape.moveTo(x, y + radius);
        shape.lineTo(x, y + height - radius);
        shape.quadraticCurveTo(x, y + height, x + radius, y + height);
        shape.lineTo(x + width - radius, y + height);
        shape.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
        shape.lineTo(x + width, y + radius);
        shape.quadraticCurveTo(x + width, y, x + width - radius, y);
        shape.lineTo(x + radius, y);
        shape.quadraticCurveTo(x, y, x, y + radius);

        var geometry = new THREE.ShapeBufferGeometry(shape);
        geometry.center();

        //var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial({color: 0xFF0000, wireframe: true}) );
        var mat;
        if (!material || material == null || material == undefined) {
            mat = new THREE.MeshPhongMaterial({ color: 0xFF0000, wireframe: true, side: THREE.DoubleSide });
        } else {
            mat = material;
        }
        var mesh = new THREE.Mesh(geometry, mat);


        return mesh;
    }



    // Main
    var group = new THREE.Group();
    var glowMeshes = [];
    var opacity,
        pw = 0,
        ph = 0;

    for (let i = 0; i < params.glowDetail; i++) {
        opacity = 1 - (1 / params.glowDetail * i);
        pw = params.width + (i / params.glowSize);
        ph = params.height + (i / params.glowSize);
        //log(opacity);
        if (opacity > 0) {
            let mat = new THREE.MeshLambertMaterial({
                color: params.color,
                transparent: true,
                opacity: opacity,
                side: THREE.DoubleSide
            });
            let roundedPlane = createRoundedPlane(0, 0, pw, ph, params.cornerRadius, mat);
            roundedPlane.position.z = -(i / 100);
            group.add(roundedPlane);
        }
    }
    return group;

}