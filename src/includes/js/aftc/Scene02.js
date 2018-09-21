// Ensure my lazy logger is available
if (!log) { function log(arg) { console.log(arg); } }
if (!vlog) { function vlog(arg) { document.getElementById("info").innerHTML = arg; } }


// Var defs
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
var intro,
    preloader,
    preloaderBar;
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
var preloaderProgressRunOnce = false;
function preloaderProgress(p) {
    var maxW = 100;
    var step = maxW / 100;
    var w = p * step;
    TweenMax.to("#preloader .bar", 0.3, { width: w + "%" });
    $("#preloader .message").html("Loaded " + p + "%");
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function preloaderComplete() {
    TweenMax.to("#preloader", 0.5, { alpha: 0 });
    TweenMax.set("#preloader", { delay: 0.5, display: "none", onComplete: scene01 });
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function scene01() {

    canvas = document.getElementById("renderCanvas");
    TweenMax.set(canvas, { opacity: 0 });
    TweenMax.to(canvas, 1, { delay: 1, opacity: 1 });

    intro = new DThree({
        canvas: "renderCanvas",
        antialias: true,
        cameraInitialPosition: new THREE.Vector3(0, 0, 15),
        cameraInitialLookAt: new THREE.Vector3(0, 0, 0),
        onResizeSetCameraPositions: false,
        onResizePortraitCameraPosition: new THREE.Vector3(0, 0, 10),
        onResizeLandscapeCameraPosition: new THREE.Vector3(0, 0, 40),
        showStats: true,
        showAxisHelper: true,
        attachControls: false,
        maxPolarAngle: 90,
        minPolarAngle: 0
    });



    var scene = intro.getScene();
    var camera = intro.getCamera();

    // Add some lights
    var ambientLight = new THREE.AmbientLight(0x101010); // Dark but dont let things go full black
    scene.add(ambientLight);

    var pointLight = new THREE.PointLight(0xFFFFFF, 1, 100);
    pointLight.position.set(5, 6.5, 6);
    scene.add(pointLight);

    var pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
    //scene.add(pointLightHelper);

    // var light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
    // var helper = new THREE.HemisphereLightHelper(light, 5);
    // scene.add(helper);


    // Setup scene
    /*
    var camDebugger = new THREEx.DebugCameraPosition({
        camera: camera
    });
    */


    // White room

    var geometry = new THREE.SphereGeometry(150, 32, 16);
    var material = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture("assets/textures/test.png"),
        side: THREE.BackSide
    });
    var mesh = new THREE.Mesh(geometry, material);
    //scene.add(mesh);


    // Floor
    var geometry = new THREE.CircleBufferGeometry(60, 32);
    var material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
    var circle = new THREE.Mesh(geometry, material);
    circle.rotation.x = deg2rad(-90);
    circle.position.y = -4;
    //scene.add( circle );


    preloader.loadNow("includes/js/threex/THREEX.StarCubemap.js", function () {
        var starCubemap = new THREEx.StarCubemap({

        });

        scene.add(starCubemap.mesh);
    });



    var model1;
    var loader = new THREE.JSONLoader();
    loader.load("assets/meshes/PirateMothership.json", function (geometry, materials) {
        var mat1 = new THREE.MeshLambertMaterial({ color: 0x000000, transparent: true, opacity: 0.7 });
        var mat2 = new THREE.MeshPhongMaterial({
            color: 0x999999,
            specular: 0x050505,
            shininess: 100,
            transparent: false,
            opacity: 1
        });
        var mat3 = new THREE.MeshPhongMaterial({ color: 0xFF0000, transparent: true, opacity: 0.7 });

        model1 = new THREE.Mesh(geometry, mat2);
        model1.scale.x = model1.scale.y = model1.scale.z = 3;
        model1.translation = geometry.center(); // Translate the rotation origin to center
        //model1.flipSided = true;
        model1.position.x = -10;
        model1.position.z = -15;
        //model1.rotation.x = deg2rad(-90);
        model1.rotation.y = deg2rad(-90);
        //model1.rotation.z = deg2rad(90);
        scene.add(model1);


        var spaceShipSoundFile = "assets/samples/spaceship_ambiance_5m8hz.mp3";
        var audio = new Audio(spaceShipSoundFile);
        audio.loop = true;
        audio.play();
        log(audio.volume);
        log(audio.loop);

        var t = 0;
        var cameraOPos = camera.position;
        var cameraShakeDist = 0.06;
        var targetVolume = 0;
        log(camera.position);
        intro.addToRenderStack(function () {
            t += 0.0001;
            //var tx = Math.sin(t) * 100;
            //model1.position.x = tx;
            model1.position.x += 0.01;
            //camera.postion.x = cameraOPos.x + Math.random() * 5;
            //log(camera);
            if (cameraOPos && camera && cameraShakeDist>0) {
                camera.position.x = cameraOPos.x + (-cameraShakeDist + Math.random() * (cameraShakeDist * 2));
                camera.position.y = cameraOPos.y + (-cameraShakeDist + Math.random() * (cameraShakeDist * 2));
                camera.position.z = cameraOPos.y + (-cameraShakeDist + Math.random() * (cameraShakeDist * 2));
            }

            if (model1.position.x > 18) {
                targetVolume = audio.volume - 0.0004;
                if (targetVolume < 0) {
                    audio.volume = 0;
                } else {
                    audio.volume = targetVolume;
                }
                
                
            }


            if (model1.position.x > -3) {
                if (cameraShakeDist > 0){
                    cameraShakeDist -= 0.00002;
                }
            }

            var msg = "";//"tx = " + tx.toFixed(4) + "<br>";
            msg += "model1.position.x = " + model1.position.x.toFixed(4) + "<br>";
            msg += "cameraShakeDist = " + cameraShakeDist + "<br>";
            
            msg += "audio.volume = " + audio.volume.toFixed(4);
            vlog(msg);
        });

    });




    /*

    function VolumeSample() {
        loadSounds(this, {
            buffer: 'assets/samples/AmbientSpaceShip.wav'
        }, onLoaded);
        function onLoaded() {
            var button = document.querySelector('button');
            button.removeAttribute('disabled');
            button.innerHTML = 'Play/pause';
        };
        this.isPlaying = false;
    };

    VolumeSample.prototype.play = function () {
        this.gainNode = context.createGain();
        this.source = context.createBufferSource();
        this.source.buffer = this.buffer;

        // Connect source to a gain node
        this.source.connect(this.gainNode);
        // Connect gain node to destination
        this.gainNode.connect(context.destination);
        // Start playback in a loop
        this.source.loop = true;
        this.source[this.source.start ? 'start' : 'noteOn'](0);
    };

    VolumeSample.prototype.changeVolume = function (element) {
        var volume = element.value;
        var fraction = parseInt(element.value) / parseInt(element.max);
        // Let's use an x*x curve (x-squared) since simple linear (x) does not
        // sound as good.
        this.gainNode.gain.value = fraction * fraction;
    };

    VolumeSample.prototype.stop = function () {
        this.source[this.source.stop ? 'stop' : 'noteOff'](0);
    };

    VolumeSample.prototype.toggle = function () {
        this.isPlaying ? this.stop() : this.play();
        this.isPlaying = !this.isPlaying;
    };
    this.play();
    */



    // Space ship sound
    /*
    var context;
    var bufferLoader;
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var context = new AudioContext();
    var sample = 'assets/samples/AmbientSpaceShip.wav';
    var saved;

    if (saved) {
        playSound(saved);
    } else {
        loadSound();
    }

    //loading sound into the created audio context
    function loadSound() {
        //set the audio file's URL
        var audioURL = sample;

        //creating a new request
        var request = new XMLHttpRequest();
        request.open('GET', audioURL, true);
        request.responseType = 'arraybuffer';
        request.onload = function () {
            log("HERE");
            //take the audio from http request and decode it in an audio buffer
            context.decodeAudioData(request.response, function (buffer) {
                // save buffer, to not load again
                saved = buffer;
                // play sound
                playSound(buffer);
            });
        };
        request.send();
    }


    //playing the audio file
    function playSound(buffer) {
        //creating source node
        var source = context.createBufferSource();
        //passing in data
        source.buffer = buffer;
        //giving the source which sound to play
        source.connect(context.destination);
        //start playing
        source.start(0);
    }
    */


    // Dragon YinYang
    /*
    var yinyang;
    var loader = new THREE.JSONLoader();
    //AuroraBattleStarText
    //DragonYinYang
    loader.load("assets/meshes/DragonYinYang.json", function (geometry, materials) {
        yinyang = geometry;
        proceed1();
    });

    function proceed1() {
        log("proceed1()");
        var mat1 = new THREE.MeshLambertMaterial({ color: 0xFF0000, transparent: true, opacity: 0.7 });
        var mat2 = new THREE.MeshPhongMaterial({
            color: 0x000000,
            specular: 0xFFFFFF,
            emissive: 0xFF0000,
            shininess: 6,
            transparent: false,
            opacity: 1
        });
        var mat3 = new THREE.MeshPhongMaterial({ color: 0xFF0000, transparent: true, opacity: 0.7 });

        var mesh = new THREE.Mesh(yinyang, mat2);
        mesh.scale.x = mesh.scale.y = mesh.scale.z = 4;
        mesh.translation = yinyang.center(); // Translate the rotation origin to center
        mesh.flipSided = true;
        mesh.position.y = -1;
        scene.add(mesh);
    }
    */



    // Curved surface using sphere
    /*
    var carTexture;
    var textureLoader = new THREE.TextureLoader();
    textureLoader.load("assets/textures/space_ship_01_1024x1024.jpg", function (texture) {
        texture.mapping = THREE.UVMapping;
        carTexture = texture;
        proceed2();
    });

    function proceed2(){
        log("proceed2()");
        var geometry = new THREE.SphereGeometry(15, 10, 10, deg2rad(-135), 2, 1, 1);
        var mat1 = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            wireframe: true
        });
        var mat2 = new THREE.MeshBasicMaterial( {
            map: carTexture,
            side:THREE.DoubleSide
		 } );
    
        mesh = new THREE.Mesh(geometry, mat2);
        mesh.position.y = 6;
        //mesh.position.z = -30;
        scene.add(mesh);
    }
    */



    // Curved Plane
    // const width2 = 5, height2 = 5, width_segments = 10, height_segments = 10;
    // plane = new THREE.PlaneGeometry(width2, height2, width_segments, height_segments);
    // var len = plane.vertices.length;
    // /*
    // for(var i=0; i<len/2; i++) {
    //     if ( (2*i) <= (len/2) ){
    //         plane.vertices[2*i].z = Math.pow(2, i/20);
    //     }
    //     if ( (2*i+1) <= (len/2) ){
    //         plane.vertices[2*i+1].z = Math.pow(2, i/20);
    //     }
    // }
    // */
    // var v = 0;
    // for (var i = 0; i < len; i++) {
    //     v = Math.pow(2, i / 50);
    //     plane.vertices[i].z = v;

    // }
    // mesh2 = new THREE.Mesh(plane, new THREE.MeshBasicMaterial({ color: 0xFF0000, wireframe: true }));
    // mesh2.doubleSided = true;
    // //mesh2.rotation.y = Math.PI/2-0.5;
    // mesh2.position.z = -5;
    // scene.add(mesh2);



    // var textureLoader = new THREE.TextureLoader();
    // textureLoader.load("images/WelshFlag001.png", function (texture) {
    //     texture.mapping = THREE.UVMapping;
    //     carTexture = texture;

    //     preloader.loadNow("includes/js/threex/TRHEEX.CurvedPlane.js", function () {
    //         var cPlane = new THREEx.CurvedPlane({
    //             color: 0xFF0000,
    //             width: 22,
    //             height: 17,
    //             segW: 22,
    //             segH: 17,
    //             curveFactor: 10,
    //             xmaterial: new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide }),
    //             material: new THREE.MeshLambertMaterial({ color: 0xFFFFFF, map: texture, side: THREE.DoubleSide })
    //         });
    //         scene.add(cPlane);
    //     });

    // });



    // Flag
    /*
    var textureLoader = new THREE.TextureLoader();
    textureLoader.load("images/WelshFlag001.png", function (texture) {
        texture.mapping = THREE.UVMapping;
        carTexture = texture;

        preloader.loadNow("includes/js/threex/THREEX.Flag.js", function () {
            var cPlane = new THREEx.Flag({
                waveDepth: 10,
                rippleSpeed: 2,
                xmaterial: new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide }),
                material: new THREE.MeshLambertMaterial({ color: 0xFFFFFF, map: texture, side: THREE.DoubleSide })
            });
            cPlane.position.y = 7;
            cPlane.position.z = -15;
            scene.add(cPlane);
        });

    });
    */







    // Rounded Plane
    // preloader.loadNow("includes/js/threex/THREEX.RoundedPlane.js",function(){
    //     var RoundedPlane = new THREEx.RoundedPlane({
    //         color: 0xFF0000,
    //         width: 3,
    //         height: 3,
    //         cornerRadius: 0.5
    //     });
    //     RoundedPlane.position.x = -5;
    //     RoundedPlane.position.z = -5;
    //     scene.add(RoundedPlane);
    // });



    // Glowing rounded shape
    // preloader.loadNow("includes/js/threex/THREEX.RoundedGlowPlane.js",function(){
    //     var RoundedGlowPlane = new THREEx.RoundedGlowPlane({
    //         color: 0xFFFF00,
    //         glowSize: 5,
    //         glowDetail: 20
    //     });
    //     scene.add(RoundedGlowPlane);
    // });



    /*
    var textureLoaderForRoundedPlane = new THREE.TextureLoader();
    textureLoaderForRoundedPlane.load("assets/textures/space_ship_01_1024x1024.jpg", function (texture) {
        //texture.mapping = THREE.UVMapping;
        var mat1 = new THREE.MeshPhongMaterial({ map: texture, side: THREE.DoubleSide });
        var mat2 = new THREE.MeshLambertMaterial({ color: 0xFF0000, transparent: false, opacity: 0.7, side: THREE.DoubleSide });
        var mat3 = new THREE.MeshLambertMaterial({ map: texture, side: THREE.DoubleSide });
        var roundedPlane = createRoundedPlane(0, 0, 10, 10, 2, mat3);
        scene.add(roundedPlane);
    });
    */


    // Rounded cube
    /*
    var createRoundedCube = function(x, y, width, height, radius) {
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
        
        var extrudeSettings = { amount: 8, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
        var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
        var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial({color: 0xFF0000, wireframe: true}) );
        return mesh;
    }
    var roundedCube = createRoundedCube(0, 0, 10, 10, 2 );
    scene.add(roundedCube);
    */



    // TweenMax.to(camera.position,2,{
    //     delay: 1.2,
    //     x: -14.65,
    //     y: 0,
    //     z: 0.14
    // })

    // TweenMax.to(camera.rotation,2,{
    //     delay: 1.2,
    //     x: 0,
    //     y: -1.49,
    //     z: 0
    // })


    // TweenMax.to(camera.position,2,{
    //     delay: 4,
    //     x: -14,
    //     y: -2.4,
    //     z: 0.04
    // })

    // TweenMax.to(camera.rotation,2,{
    //     delay: 4,
    //     x: 0,
    //     y: -1.54,
    //     z: 0
    // })
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
$(document).ready(function () {
    log("document.ready()");

    preloaderBar = document.getElementsByClassName("preloaderBar")[0];

    preloader = new AFTC.Preloader({
        onComplete: preloaderComplete,
        onProgress: preloaderProgress
    });


    preloader.add("img1", "assets/textures/test.png", "png");

    preloader.add("model1", "assets/meshes/AuroraBattleStarText.json", "json");
    preloader.add("model2", "assets/meshes/PirateMothership.json", "json");
    preloader.add("model3", "assets/meshes/DragonYinYang.json", "json");


    preloader.add("starfield2a", "assets/textures/starfield_1.png", "image");
    preloader.add("starfield2a", "assets/textures/starfield_2a.jpg", "image");
    preloader.add("starfield2b", "assets/textures/starfield_2b.png", "image");

    preloader.add("starfield2b", "assets/textures/nebula_03/neb_nx.jpg", "image");
    preloader.add("starfield2b", "assets/textures/nebula_03/neb_px.jpg", "image");
    preloader.add("starfield2b", "assets/textures/nebula_03/neb_ny.jpg", "image");
    preloader.add("starfield2b", "assets/textures/nebula_03/neb_py.jpg", "image");
    preloader.add("starfield2b", "assets/textures/nebula_03/neb_nz.jpg", "image");
    preloader.add("starfield2b", "assets/textures/nebula_03/neb_pz.jpg", "image");


    preloader.add("js1", "includes/js/misc/lodash.min.js", "javascript");

    preloader.add("js2", "includes/js/threejs/three.js", "javascript");
    preloader.add("js3", "includes/js/threejs/controls/OrbitControls.js", "javascript");
    preloader.add("js3", "includes/js/threejs/controls/FlyControls.js", "javascript");
    preloader.add("js4", "includes/js/threejs/Detector.js", "javascript");
    preloader.add("js5", "includes/js/threejs/libs/stats.min.js", "javascript");

    preloader.add("js6", "includes/js/DTools.js", "javascript");
    preloader.add("js6", "includes/js/DThree.js", "javascript");

    preloader.add("js7", "includes/js/threex/THREEX.SphericalStarField.js", "javascript");
    preloader.add("js7", "includes/js/threex/THREEX.StarCubemap.js", "javascript");
    preloader.add("js7", "includes/js/threex/THREEX.DebugCameraPosition.js", "javascript");

    preloader.start();

});