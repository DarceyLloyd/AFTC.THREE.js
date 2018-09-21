/*
 * Author: Darcey@AllForTheCode.co.uk
 * Version: 1.0
*/

// Ensure my lazy logger is available
if (!log) { function log(arg) { console.log(arg); } }

var AFTC = AFTC || {}
AFTC.THREE = AFTC.THREE || {}

AFTC.THREE.StarCubemap = function () {

    var me = this; // Accessor
    
    var params = {
            app,
            scene,
            assetPath:"assets/textures/nebula_03/",
            assets:[
                params.assetPath + 'neb_px.jpg',
                'neb_nx.jpg',
                'neb_py.jpg',
                'neb_ny.jpg',
                'neb_pz.jpg',
                'neb_nz.jpg'
            ]
        };

    log(params);


    // Process arguments
    if (arguments[0] && typeof (arguments[0]) == "object") {

        for (var key in arguments[0]) {
            if (arguments[0].hasOwnProperty(key)) {
                params[key] = arguments[0][key];
            } else {
                if (console) {
                    if (console.error) {
                        console.error("AFTC.THREE.StarCubemap: ERROR: Unknown paramater: [" + key + "]");
                    }
                }
            }
        }
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



    var 
    var fileType = ".jpg";
    var urls = [
        path + 'neb_px' + fileType,
        path + 'neb_nx' + fileType,
        path + 'neb_py' + fileType,
        path + 'neb_ny' + fileType,
        path + 'neb_pz' + fileType,
        path + 'neb_nz' + fileType
    ];

    var textureCube = THREE.ImageUtils.loadTextureCube(urls, THREE.CubeRefractionMapping);

    var shader = THREE.ShaderLib["cube"];
    shader.uniforms.tCube.value = textureCube;

    var material = new THREE.ShaderMaterial({
        fragmentShader: shader.fragmentShader,
        vertexShader: shader.vertexShader,
        uniforms: shader.uniforms,
        depthWrite: false,
        side: THREE.BackSide
    });


    var reflectionMaterial = new THREE.MeshPhongMaterial({
        // color: 0xFFFFFF,
        // emissive: 0xFFFFFF,
        reflectivity: 0.91,
        //shininess: 100,
        envMap: textureCube
    });

    var mesh = new THREE.Mesh(new THREE.BoxGeometry(100, 100, 100), material);
    //app.getScene().add(mesh1);

    // var mesh2 = new THREE.Mesh(new THREE.BoxBufferGeometry(4, 4, 4), reflectionMaterial);
    // app.getScene().add(mesh2);
    var t = 0;

    return {
        mesh,
        renderFn: function (me) {
            t += 0.01;
            //mesh.rotation.x += 0.1;
            //var s = 1 + (Math.sin(t) * 1);
            //mesh.scale.set(s,s,s)
        },
        textureCube,
        reflectionMaterial
    };
}




/*
 var mat1 = new THREE.MeshBasicMaterial({ color: 0xffffff, envMap: textureCube }); // Will reflect on outside
    var mat2 = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.BackSide, envMap: textureCube }); // Will reflect on inside
    mat2.mapping = THREE.CubeReflectionMapping;
    var mat3 = new THREE.MeshPhongMaterial({ color: 0xffffff, side: THREE.BackSide, envMap: textureCube, refractionRatio: 0.98, reflectivity: 0.9 });
    mat3.mapping = THREE.CubeReflectionMapping;

    let mat4 = THREE.ImageUtils.loadTextureCube(urls, THREE.CubeRefractionMapping);
    let shader = THREE.ShaderLib.cube;
*/