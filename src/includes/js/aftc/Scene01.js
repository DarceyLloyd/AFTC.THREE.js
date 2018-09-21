


// Var defs
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
var demo,
    preloader,
    preloaderBar,
    canvas,
    scene,
    camera,
    ambientLight,
    pointLight,
    pointLightHelper;
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function buildScene() {

    canvas = document.getElementById("renderCanvas");
    $("#renderCanvas").css("opacity",0).fadeIn();

    log(THREE);

    demo = new AFTC.THREE({
        canvas: "renderCanvas",
        antialias: true,
        a:2,
        onResizeSetCameraPosition: true,
        cameraInitialPosition: new THREE.Vector3(0, 0, 44),
        cameraInitialLookAt: new THREE.Vector3(0, 0, 0),
        onResizePortraitCameraPosition: new THREE.Vector3(0, 0, 44),
        onResizeLandscapeCameraPosition: new THREE.Vector3(0, 0, 14),
        showStats: false,
        showAxisHelper: false,
        attachControls: true
    });


    scene = demo.getScene();
    camera = demo.getCamera();
    // Add some lights

    // Lighting & Test Illumination Object
    // Globally illuminates all objects in the scene equally
    ambientLight = new THREE.AmbientLight(0x101010); // Dark but dont let things go full black
    scene.add(ambientLight);

    pointLight = new THREE.PointLight(0xFFFFFF, 1, 100);
    pointLight.position.set(5, 6.5, 6);
    scene.add(pointLight);

    pointLightHelper = new THREE.PointLightHelper(pointLight, 1);
    scene.add(pointLightHelper);

    

    // Setup scene

    // SphericalStarField
    // var starField = new THREEx.SphericalStarField({ app: demo, rx: 0.0003 });
    // scene.add(starField.mesh);
    // demo.addToRenderStack(starField.renderFn);

    // StarCubemap
    var starField = new AFTC.THREE.StarCubemap({ app: demo });
    demo.addToRenderStack(starField.renderFn);
    scene.add(starField.mesh);

    //var auroraText = new THREEx.AuroraText({ app: demo, material:starField.reflectionMaterial,scale: 5 });
    var auroraText = new THREEx.AuroraText({ app: demo, scale: 5 });
    scene.add(auroraText.mesh);
    //demo.addToRenderStack(starField.renderFn);


}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

