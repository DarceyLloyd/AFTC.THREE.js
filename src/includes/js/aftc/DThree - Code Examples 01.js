/*
 * Author: Darcey@AllForTheCode.co.uk
 * Version: 1.0
*/

// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
var App = function () {

    // Var defs
    var me = this;

    this.params = {

    };

    var canvas = null,
        stats,
        scene,
        camera,
        renderer,
        controls;

    var timeLast = Date.now(),
        sceneParams = {},
        renderStack = [],
        clock = new THREE.Clock(),
        t = 0;

    var setupStats = true,
        setupAxisHelper = true,
        axisHelperSize = 10,
        antialias = true,
        cameraPosition = new THREE.Vector3(0, 0, 10);

    //this.scene = null;
    //this.camera = null;
    //this.sceneParams = {};
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



    // Process arguments
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    if (arguments[0] && typeof (arguments[0]) == "object") {

        // Canvas
        if (typeof (arguments[0].canvas) == "object") {
            // Check object is canvas object
            if (arguments[0].canvas.nodeName == "CANVAS") {
                canvas = arguments[0].canvas;
            }
        } else if (typeof (arguments[0].canvas) == "string") {
            canvas = document.getElementById(arguments[0].canvas);
        }

        // Camera
        if (arguments[0].camera) {
            camera = arguments[0].camera;
        }

        // Camera position
        if (arguments[0].cameraPosition) {
            cameraPosition = arguments[0].cameraPosition;
        }

        // Controls
        if (arguments[0].controls) {
            controls = arguments[0].controls;
        }

        // Antialias
        if (arguments[0].antialias) {
            antialias = arguments[0].antialias;
        }
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Private functions
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    function constructor() {
        log("app.constructor()");
        if (!Detector.webgl) {
            Detector.addGetWebGLMessage();
            log(Detector);
            $("#no-webgl").show();
        } else {
            $("#no-webgl").hide();
            preload();
        }
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    function dispatch(e) {
        e.name.toLowerCase();

        switch (e.name) {
            case "three setup complete":
                log("app.dispatch('three setup complete')");
                break;


            case "show stats":
                log("app.dispatch('show stats')");
                stats.show();
                break;
            case "hide stats":
                log("app.dispatch('hide stats')");
                stats.hide();
                break;


            case "fade in":
                log("app.dispatch('threejs setup complete')");
                break;

            case "fade out":
                log("app.dispatch('threejs setup complete')");
                break;

            case "start renderer":
                log("app.dispatch('start renderer')");
                break;

            case "stop renderer":
                log("app.dispatch('stop renderer')");
                break;

            default:
                log("app.display(): ERROR: Unhandled event name of [" + e.name + "]");
                break;
        }
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -





    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    function preload() {
        log("app.preload()");
        preloadComplete();
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    function preloadComplete() {
        log("app.preloadComplete()");

        setupThree();
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    function setupThree() {
        log("app.setupThree()");

        // Stats
        if (setupStats) {
            stats = new Stats();
            stats.id = "stats";
            stats.setMode(0); // 0: fps, 1: ms
            stats.domElement.style.position = 'absolute';
            stats.domElement.style.left = 0;
            stats.domElement.style.top = 0;
            stats.domElement.style.zoom = 1.5;
            document.body.appendChild(stats.domElement);
        }


        // Scene
        scene = new THREE.Scene();

        // Camera
        //https://threejs.org/docs/#api/cameras/PerspectiveCamera
        camera = new THREE.PerspectiveCamera(
            60, // Camera frustum vertical field of view (45,60 are common values)
            window.innerWidth / window.innerHeight, // Camera frustum aspect ratio
            0.01, // Camera frustum near plane
            1000 // Camera frustum far plane
        );
        camera.position.x = cameraPosition.x;
        camera.position.y = cameraPosition.y;
        camera.position.z = cameraPosition.z;
        camera.lookAt(new THREE.Vector3(0, 0, 0));


        //https://threejs.org/docs/#api/renderers/WebGLRenderer
        // Use canvas is supplied else create the dom element and add it here
        if (canvas) {
            renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: antialias });
        } else {
            renderer = new THREE.WebGLRenderer({ antialias: antialias });
        }

        renderer.setClearColor(new THREE.Color(0xFFCC00));
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        if (!canvas) {
            document.body.appendChild(renderer.domElement); // Direct dom inject instead of canvas tags
        }


        // Controls
        if (!controls) {
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enablePan = false;
            controls.enableZoom = false;
            controls.minDistance = 20;
            controls.maxDistance = 50;
            controls.enableDamping = true;
            controls.minPolarAngle = deg2rad(15); // 15 deg from looking straight down
            controls.maxPolarAngle = deg2rad(155); // 15 deg from looking straight up
            controls.dampingFactor = 0.07;
            controls.rotateSpeed = 0.07;
        }



        // Axis Helper
        axisHelper = new THREE.AxisHelper(10);
        scene.add(axisHelper);


        // Resize handler
        $(window).resize(function () {
            threejsWindowResizeHandler();
        });


        // Ensure this is last
        renderStack.push(function () {
            renderer.render(scene, camera);
        });

        let e = { name: "three setup complete" };
        dispatch(e);

        requestAnimationFrame(animate);
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    function threejsWindowResizeHandler() {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    function animate() {
        if (stats) {
            stats.update();
        }


        // If inertia / dampening is on, we need to run this in render/update/animate etc       
        if (controls.enableDamping) {
            controls.update();
        }

        // Process render stack
        var timeNow = Date.now();
        renderStack.forEach(function (fn) {
            fn(timeNow, timeNow - timeLast);
        });
        timeLast = timeNow;

        t += 0.01;
        requestAnimationFrame(animate);
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -









    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    function addStars() {
        log("app.addStars()");

        // STARS
        sceneParams.starsGeometry = new THREE.SphereGeometry(90, 32, 32);
        sceneParams.starsMaterial = new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/textures/starfield_2b.png'),
            side: THREE.BackSide
        });
        sceneParams.stars = new THREE.Mesh(sceneParams.starsGeometry, sceneParams.starsMaterial);
        scene.add(sceneParams.stars);

        var starAnimator = function () {
            if (sceneParams.stars) {
                //stars.rotation.y += deg2rad(0.1);
            }
        }
        renderStack.push(starAnimator);
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -






    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Public functions
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    this.addToRenderStack = function (func) {
        renderStack.push(func);
    }

    this.extend = function (fn) {
        fn(this);
    }

    this.getScene = function () { return scene; }
    this.getCamera = function () { return camera; }
    this.getRenderer = function () { return renderer; }
    this.getSceneParams = function () { return sceneParams; }
    this.getTime = function () { return t; }

    this.credits = function () {
        log("app.credits()");
        log("\t" + "Author: Darcey@AllForTheCode.co.uk");
    }


    // Simulate constructor execution (best to be placed at end of function)
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    constructor();
}
// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #





// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
var intro;


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
$(document).ready(function () {
    log("document.ready()");

    intro = new App({
        canvas: "renderCanvas",
        antialias: false,
        cameraPosition: new THREE.Vector3(0, 0, 10)
    });


    var scene = intro.getScene();
    // Add some lights

    // Lighting & Test Illumination Object
    // Globally illuminates all objects in the scene equally
    var ambientLight = new THREE.AmbientLight(0x101010); // Dark but dont let things go full black
    scene.add(ambientLight);

    var pointLight = new THREE.PointLight(0xFFFF00, 1, 100);
    pointLight.position.set(5, 6.5, 6);
    scene.add(pointLight);

    var pointLightHelper = new THREE.PointLightHelper(pointLight, 1);
    scene.add(pointLightHelper);

    // var light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
    // var helper = new THREE.HemisphereLightHelper(light, 5);
    // scene.add(helper);


    // Setup scene
    //var starField = new THREEx.SphericalStarField({app:intro,rx:0.0001});
    //scene.add(starField.mesh);
    //intro.addToRenderStack(starField.renderFn);

    var auroraText = new THREEx.AuroraText({ app: intro, scale: 6 });
    //log(auroraText);
    scene.add(auroraText.mesh);
    //intro.addToRenderStack(starField.renderFn);




    /*
    var script = document.createElement('script');
    script.onload = function () {
        //do stuff with the script
    };
    script.src = something;
    
    document.head.appendChild(script); //or something of the likes
    
    */



    // intro.extend(function (app) {
    //     log("HERE");
    //     var scene = app.getScene();
    //     var sceneParams = app.getSceneParams();

    //     var nLasers = 14
    //     for (var i = 0; i < nLasers; i++) {
    //         (function () {
    //             var laserBeam = new THREEx.LaserBeam()
    //             scene.add(laserBeam.object3d)
    //             var laserCooked = new THREEx.LaserCooked(laserBeam)
    //             onRenderFcts.push(function (delta, now) {
    //                 laserCooked.update(delta, now)
    //             })
    //             var object3d = laserBeam.object3d
    //             object3d.position.x = (i - nLasers / 2) / 2
    //             object3d.position.y = 4
    //             object3d.rotation.z = -Math.PI / 2
    //         })()
    //     }
    // });

});