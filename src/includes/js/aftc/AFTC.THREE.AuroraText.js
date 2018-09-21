/*
 * Author: Darcey@AllForTheCode.co.uk
 * Version: 1.0
*/

// Ensure my lazy logger is available
if (!log) { function log(arg) { console.log(arg); } }

var THREEx = THREEx || {}

THREEx.AuroraText = function () {

    var me = this;

    var app,
        scene,
        renderer,
        material,
        scale = 1.75;

    // Process arguments
    if (arguments[0] && typeof (arguments[0]) == "object") {

        if (arguments[0].app) {
            // Access to DThree can be had via app but is not necessary: var app = arguments[0].app;
            // var scene = app.getScene();
            // var sceneParams = app.getSceneParams();
            app = arguments[0].app;
            renderer = app.getRenderer();
            scene = app.getScene();
        }

        if (arguments[0].scale) { scale = parseFloat(arguments[0].scale); }
        if (arguments[0].material) { material = arguments[0].material; }
        log(material);
    }


    var assets = [
        'assets/meshes/AuroraBattleStarText.json'
    ]

    var loaded = {
        model: false,
        texture: false
    };

    var geometries = {};
    var textures = {};

    var cameras = {};
    var lights = {};
    var materials = {};
    var meshes = {};

    var group = new THREE.Group();

    var loader = new THREE.JSONLoader();
    loader.load(assets[0], function (geometry, materials) {
        geometries.auroraText = geometry;

        loaded.model = true;

        checkLoad();
    });

    // var textureLoader = new THREE.TextureLoader();
    // textureLoader.load(assets[1], function (texture) {
    //     texture.mapping = THREE.UVMapping;

    //     textures.room = texture;

    //     loaded.texture = true;
    //     checkLoad();
    // });
    loaded.texture = true;




    function checkLoad() {
        log("THREEx.AuroraText.checkLoad()");

        if (loaded.model && loaded.texture) {
            build();
        }
    }





    function build() {
        log("THREEx.AuroraText.build()");

        materials.mat1 = new THREE.MeshLambertMaterial({ color: 0xFF0000 });

        materials.mat2 = new THREE.MeshPhongMaterial({
            color: 0xFFFFFF,
            specular: 0x050505,
            shininess: 100
        });

        if (!material) {
            material = materials.mat2;
        }

        
        // Aurora Text
        meshes.auroraText = new THREE.Mesh(geometries.auroraText, material);
        meshes.auroraText.scale.x = meshes.auroraText.scale.y = meshes.auroraText.scale.z = scale;
        //meshes.auroraText.translation = THREE.GeometryUtils.center(geometry); // Translate the rotation origin to center (DEP)
        meshes.auroraText.translation = geometries.auroraText.center(); // Translate the rotation origin to center
        meshes.auroraText.flipSided = true;
        group.add(meshes.auroraText);





    }



    return {
        mesh: group,
        renderFn: function () {

        }
    };
};
