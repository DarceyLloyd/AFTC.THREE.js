/*
 * Author: Darcey@AllForTheCode.co.uk
 * Version: 1.0.0
*/

// Ensure some standard functions are available
if (!log) { function log(arg) { if (console) { console.log(arg); } } } // My lazy logger
if (!deg2rad) { function deg2rad(deg) { var radians = deg * Math.PI / 180; return radians; } } // Degrees to Radians
if (!rad2deg) { function rad2deg(rad) { var degree = rad * 180 / Math.PI; return degree; } } // Radians to Degrees



// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
var AFTC = AFTC || {}
AFTC.THREE = function () {
    // Var defs
    var me = this; // Accessor for this when scope is lost

    // Note these will be overwritten by anything supplied in arguments[0]
    var params = {
        antialias: true,
        clearColor: 0x000000,
        showStats: true,
        statsOpacity: 0.65,
        showAxisHelper: false,
        axisHelperSize: 10,
        cameraInitialPosition: new THREE.Vector3(0, 0, 20),
        cameraInitialLookAt: new THREE.Vector3(0, 0, 0),
        onResizeSetCameraPosition: false,
        onResizePortraitCameraPosition: new THREE.Vector3(0, 0, 20),
        onResizeLandscapeCameraPosition: new THREE.Vector3(0, 0, 50),
        minPolarAngle: 15,
        maxPolarAngle: 155,
        customCamera: null,
        cameraNear: 0.01,
        cameraFar: 1000,
        fov: 60,
        controls: null,
        attachControls: true,
        attachDefaultRenderer: true
    };

    var canvas,
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
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



    // Process arguments
    if (arguments[0] && typeof (arguments[0]) == "object") {

        for (var key in arguments[0]) {
            if (params.hasOwnProperty(key)) {
                params[key] = arguments[0][key];
            } else {
                if (console){
                    if (console.error){
                        console.error("AFTC.THREE: ERROR: Unknown paramater: [" + key + "]");
                    }
                }
            }
        }
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Private functions
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    function constructor() {

        if (!Detector.webgl) {
            Detector.addGetWebGLMessage();
            log(Detector);
            $("#no-webgl").show();
        } else {
            $("#no-webgl").hide();
            setupThree();
        }
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    function dispatch(e) {
        var n = e.name.toLowerCase();

        switch (n) {
            case "three setup complete":
                //log("app.dispatch('three setup complete')");
                break;


            case "show stats":
                //log("app.dispatch('show stats')");
                stats.show();
                break;
            case "hide stats":
                //log("app.dispatch('hide stats')");
                stats.hide();
                break;


            case "fade in":
                //log("app.dispatch('threejs setup complete')");
                break;

            case "fade out":
                //log("app.dispatch('threejs setup complete')");
                break;

            case "start renderer":
                //log("app.dispatch('start renderer')");
                break;

            case "stop renderer":
                //log("app.dispatch('stop renderer')");
                break;

            default:
                //log("app.display(): ERROR: Unhandled event name of [" + e.name + "]");
                break;
        }
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -








    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    function setupThree() {
        //log("app.setupThree()");

        // Stats
        if (params.showStats) {
            stats = new Stats();
            stats.id = "stats";
            stats.setMode(0); // 0: fps, 1: ms
            stats.domElement.style.position = 'absolute';
            stats.domElement.style.left = 0;
            stats.domElement.style.top = 0;
            stats.domElement.style.zoom = 1.2;
            stats.domElement.style.opacity = params.statsOpacity;
            document.body.appendChild(stats.domElement);
        }


        // Scene
        scene = new THREE.Scene();

        // Camera
        //https://threejs.org/docs/#api/cameras/PerspectiveCamera
        if (params.customCamera != null) {
            camera = params.customCamera;
        }

        if (!camera) {
            camera = new THREE.PerspectiveCamera(
                params.fov, // Camera frustum vertical field of view (45,60 are common values)
                window.innerWidth / window.innerHeight, // Camera frustum aspect ratio
                params.cameraNear, // Camera frustum near plane
                params.cameraFar // Camera frustum far plane
            );
            camera.position.x = params.cameraInitialPosition.x;
            camera.position.y = params.cameraInitialPosition.y;
            camera.position.z = params.cameraInitialPosition.z;
            camera.lookAt(params.cameraInitialLookAt);
        }




        // Canvas
        //https://threejs.org/docs/#api/renderers/WebGLRenderer

        if (typeof (params.canvas) == "object") {
            // Check object is canvas object
            if (params.canvas.nodeName == "CANVAS") {
                canvas = params.canvas;
            }
        } else if (typeof (params.canvas) == "string") {
            canvas = document.getElementById(params.canvas);
        }

        if (canvas) {
            renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: params.antialias });
        } else {
            renderer = new THREE.WebGLRenderer({ antialias: params.antialias });
        }

        renderer.setClearColor(new THREE.Color(params.clearColor));
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);

        if (!canvas) {
            document.body.appendChild(renderer.domElement); // Direct dom inject instead of canvas tags
        }


        // Controls
        if (params.controls != null || params.controls != undefined || params.controls) {
            controls = params.controls;
        }

        if ((controls == null || controls == undefined || !controls) && params.attachControls == true) {
            if (THREE.OrbitControls){
                controls = new THREE.OrbitControls(camera, renderer.domElement);
                controls.enablePan = false;
                controls.enableZoom = true;
                //controls.minDistance = 20;
                //controls.maxDistance = 50;
                controls.enableDamping = true;
                controls.minPolarAngle = deg2rad(params.minPolarAngle); // deg limit from looking straight down
                controls.maxPolarAngle = deg2rad(params.maxPolarAngle); // deg limit from looking straight up
                controls.dampingFactor = 0.07;
                controls.rotateSpeed = 0.07;
            }
            
        }



        // Axis Helper
        if (params.showAxisHelper) {
            axisHelper = new THREE.AxisHelper(params.axisHelperSize);
            scene.add(axisHelper);
        }



        // Resize handler
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        $(window).resize(function () {
            resizeHandler();
        });
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


        // Orientation change
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        $(window).on("orientationchange", function () {
            // Delay as orientation change takes time on devices
            setTimeout(function () {
                resizeHandler();
            }, 300);
        });


        resizeHandler(true);
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -






        // Ensure this is last
        if (params.attachDefaultRenderer){
            renderStack.push(function () {
                renderer.render(scene, camera);
            });
        }
        

        var e = { name: "three setup complete" };
        dispatch(e);

        // Star things going
        requestAnimationFrame(render);
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    function resizeHandler(init) {
        var targetPosition,
            windowHalfX = window.innerWidth / 2,
            windowHalfY = window.innerHeight / 2,
            withinTollerance = true,
            tollerance = 2;

        if (params.onResizeSetCameraPosition) {
            if (window.innerWidth > window.innerHeight) {
                // landscape mode
                // log("resize for landscape!");
                targetPosition = params.onResizeLandscapeCameraPosition;
            } else {
                // portrait mode
                // log("resize for portrait!");
                targetPosition = params.onResizePortraitCameraPosition;
            }


            if (camera.position.x < (targetPosition.x - tollerance) || camera.position.x > (targetPosition.x + tollerance)) {
                //log("X is outside of tollerance range");
                withinTollerance = false;
            }
            if (camera.position.y < (targetPosition.y - tollerance) || camera.position.y > (targetPosition.y + tollerance)) {
                //log("Y is outside of tollerance range");
                withinTollerance = false;
            }
            if (camera.position.z < (targetPosition.z - tollerance) || camera.position.z > (targetPosition.z + tollerance)) {
                //log("Z is outside of tollerance range");
                withinTollerance = false;
            }

            if (init == true) {
                camera.position.x = targetPosition.x;
                camera.position.y = targetPosition.y;
                camera.position.z = targetPosition.z;
                camera.lookAt(params.cameraInitialLookAt);
                log("camera-init");
            } else {
                if (!withinTollerance) {
                    TweenMax.to(camera.position, 0.75, {
                        delay: 0.2,
                        x: targetPosition.x,
                        y: targetPosition.y,
                        z: targetPosition.z,
                        onUpdate: function () {
                            //camera.lookAt(new THREE.Vector3(3, 10, 10));
                        }
                    });
                }
            }
        }

        camera.aspect = window.innerWidth / window.innerHeight;
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.updateProjectionMatrix();
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    function render() {
        if (stats) {
            stats.update();
        }


        // If inertia / dampening is on, we need to run this in render/update/animate etc       
        if (controls && controls != null && controls != undefined) {
            if (controls.enableDamping) {
                controls.update();
            }
        }

        // Process render stack
        var timeNow = Date.now();
        renderStack.forEach(function (fn) {
            fn(timeNow, timeNow - timeLast);
        });
        timeLast = timeNow;

        t += 0.01;
        requestAnimationFrame(render);
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

    // getters and setters
    this.getScene = function () { return scene; }
    this.setScene = function (arg) { scene = arg; }

    this.getCamera = function () { return camera; }
    this.setCamera = function (arg) { camera = arg; }

    this.getRenderer = function () { return renderer; }
    this.setRenderer = function (arg) { renderer = arg; }

    this.getControls = function () { return controls; };
    this.setControls = function (arg) { controls = arg; };

    this.getParams = function () { return params; }

    this.getSceneParams = function () { return sceneParams; }

    this.getClock = function () { return clock; }
    this.getTime = function () { return t; }

    this.getStats = function () { return stats; }


    this.credits = function () {
        log("app.credits()");
        log("\t" + "Author: Darcey@AllForTheCode.co.uk");
    }


    // Simulate constructor execution (best to be placed at end of function)
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    constructor();
    // Want an init / start function? comment out the lin above and uncomment the 3 lines below
    // this.init = function(){
    //     constructor();
    // }
}
// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #




