/*
 * Author: Darcey@AllForTheCode.co.uk
 * Version: 1.0
*/


var THREEx = THREEx || {}

THREEx.AuroraText = function () {

    var me = this;

    var app,
        scene,
        renderer,
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
    }


    var assets = [
        'assets/meshes/AuroraBattleStarText.json',
        'assets/textures/panoramics/room.jpg'
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

    var textureLoader = new THREE.TextureLoader();
    textureLoader.load(assets[1], function (texture) {
        texture.mapping = THREE.UVMapping;

        textures.room = texture;

        loaded.texture = true;
        checkLoad();
    });




    function checkLoad() {
        if (loaded.model && loaded.texture) {
            build();
        }
    }


    // WARNING
    /*

    THE BUILD CODE HERE HAS SOME MENTAL SHIT GOING ON...
    1. Things wont work unless used
    2. Things which should work dont
    3. MrDoob focusing on more advanced stuff rather than getting the basics of the engine working correctly as usual....


    */



    function build() {
        materials.LambertRed = new THREE.MeshLambertMaterial({ color: 0xFF0000 });
        
        /*
        materials.room = new THREE.MeshBasicMaterial( { map: textures.room } );
        meshes.room = new THREE.Mesh( new THREE.SphereBufferGeometry( 500, 32, 16 ), materials.room );
        meshes.room.scale.x = -1;
        scene.add( meshes.room );
        */


        var path = "assets/textures/nebula_03/";
        var urls = [
            path + 'neb_px.jpg',
            path + 'neb_nx.jpg',
            path + 'neb_py.jpg',
            path + 'neb_ny.jpg',
            path + 'neb_pz.jpg',
            path + 'neb_nz.jpg'
        ];
        var textureCube = new THREE.CubeTextureLoader().load(urls);
        //textureCube.format = THREE.RGBFormat;
        //textureCube.mapping = THREE.CubeReflectionMapping;

        var cubeShader = THREE.ShaderLib["cube"];
        var cubeMaterial = new THREE.ShaderMaterial({
            fragmentShader: cubeShader.fragmentShader,
            vertexShader: cubeShader.vertexShader,
            uniforms: cubeShader.uniforms,
            depthWrite: false,
            side: THREE.BackSide
        });
        


        var textureEquirec = textures.room;
        textureEquirec.mapping = THREE.EquirectangularReflectionMapping;
        textureEquirec.magFilter = THREE.LinearFilter;
        textureEquirec.minFilter = THREE.LinearMipMapLinearFilter;

        var equirectShader = THREE.ShaderLib["equirect"];
        var equirectMaterial = new THREE.ShaderMaterial({
            fragmentShader: equirectShader.fragmentShader,
            vertexShader: equirectShader.vertexShader,
            uniforms: equirectShader.uniforms,
            depthWrite: false,
            side: THREE.BackSide
        });
        equirectMaterial.uniforms["tEquirect"].value = textureEquirec;


        var ref1 = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: textureCube } ); 


        
        // Skybox (WARNING - cubeMaterial doesnt show untill its used on sphereMaterial with textureCube)
        var cubeMesh = new THREE.Mesh(new THREE.BoxBufferGeometry(50, 50, 50), cubeMaterial);
        scene.add(cubeMesh);

        var geometry = new THREE.SphereBufferGeometry(2, 32, 32);
        sphereMaterial = new THREE.MeshLambertMaterial({ emissive: 0xFFFFFF, envMap: textureCube });
        sphereMesh = new THREE.Mesh(geometry, sphereMaterial);
        sphereMesh.position.y -= 6;
        scene.add(sphereMesh);


        // Aurora Text
        meshes.auroraText = new THREE.Mesh(geometries.auroraText, sphereMaterial);
        meshes.auroraText.scale.x = meshes.auroraText.scale.y = meshes.auroraText.scale.z = scale;
        //meshes.auroraText.translation = THREE.GeometryUtils.center(geometry); // Translate the rotation origin to center (DEP)
        meshes.auroraText.translation = geometries.auroraText.center(); // Translate the rotation origin to center
        meshes.auroraText.flipSided = true;
        group.add(meshes.auroraText);

        
        
        // Spheres
        var geometry = new THREE.SphereBufferGeometry(3, 32, 32);
        sphereMaterial1 = new THREE.MeshLambertMaterial({ emissive: 0xFFFF00, envMap: textureEquirec });
        sphereMaterial1.needsUpdate = true;


        var sphere1 = new THREE.Mesh(geometry, ref1);
        sphere1.position.x += 5;
        sphere1.position.y -= 6;
        scene.add(sphere1);

        var sphere2 = new THREE.Mesh(geometry, sphereMaterial1);
        sphere2.position.x += -5;
        sphere2.position.y -= 6;
        scene.add(sphere2);


        /*
        var path = "assets/textures/nebula_03/";
        var urls = [
            path + 'neb_px.jpg',
            path + 'neb_nx.jpg',
            path + 'neb_py.jpg',
            path + 'neb_ny.jpg',
            path + 'neb_pz.jpg',
            path + 'neb_nz.jpg'
        ];
        var textureCube = new THREE.CubeTextureLoader().load(urls);
        textureCube.format = THREE.RGBFormat;
        textureCube.mapping = THREE.CubeReflectionMapping;

        var textureSphere = textureLoader.load("assets/textures/metal.jpg");
        textureSphere.mapping = THREE.SphericalReflectionMapping;

        var cubeShader = THREE.ShaderLib["cube"];
        var cubeMaterial = new THREE.ShaderMaterial({
            fragmentShader: cubeShader.fragmentShader,
            vertexShader: cubeShader.vertexShader,
            uniforms: cubeShader.uniforms,
            depthWrite: false,
            side: THREE.BackSide
        });

        // Skybox
        var cubeMesh = new THREE.Mesh(new THREE.BoxBufferGeometry(50, 50, 50), cubeMaterial);
        scene.add(cubeMesh);


        var geometry = new THREE.SphereBufferGeometry(8, 32, 32);
        sphereMaterial = new THREE.MeshLambertMaterial({ emissive: 0xFFFF00, envMap: textureCube });
        sphereMesh = new THREE.Mesh(geometry, sphereMaterial);
        scene.add(sphereMesh);
        */


        function rend() {
            //renderer.render(sceneCube,cubeCamera);
        }
        requestAnimationFrame(rend);


        // meshes.cube = new THREE.Mesh( new THREE.BoxBufferGeometry( 4, 4, 4 ), materials.mat2 );
        // group.add( meshes.cube );


        /*
        // Works
        var cubemap = new THREE.CubeTextureLoader()
        .setPath( 'assets/textures/nebula_03/' )
        .load( [
            'neb_px.jpg',
            'neb_nx.jpg',
            'neb_py.jpg',
            'neb_ny.jpg',
            'neb_pz.jpg',
            'neb_nz.jpg'
        ] );
        scene.background = cubemap;
        var reflectionMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: scene.background } ); // Works
        var reflectionMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: textureCube } ); // Works
        meshes.cube = new THREE.Mesh( new THREE.BoxBufferGeometry( 4, 4, 4 ), reflectionMaterial );
        group.add( meshes.cube );
        */




        //var reflectionMaterial1 = new THREE.MeshPhongMaterial({color: 0xFFFFFF,envMap: cubemap});

        //var reflectionMaterial3 = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: materials.mat2 } );





        // cameras.cube1 = new THREE.CubeCamera( 1, 1000, 256 );
        // cameras.cube1.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter;
        // scene.add( cameras.cube1 );

        // cameras.cube2 = new THREE.CubeCamera( 1, 1000, 256 );
        // cameras.cube2.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter;
        // scene.add( cameras.cube2 );



        // var chromeMaterial = new THREE.MeshLambertMaterial( { color: 0xffffff, envMap: cameras.cube2.renderTarget } );


        // materials.mat2 = new THREE.MeshBasicMaterial( {
        //     envMap: cameras.cube2.renderTarget.texture
        // } );






    }



    return {
        mesh: group,
        renderFn: function () {
            if (mesh) {
                //auroraText.mesh.rotation.y += deg2rad(0.3);
                log(1);
                //material.envMap = cubeCamera2.renderTarget.texture;
            }
        }
    };
};
