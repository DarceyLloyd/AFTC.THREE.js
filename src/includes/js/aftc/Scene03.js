// Ensure my lazy logger is available
if (!log) { function log(arg) { console.log(arg); } }


// Var defs
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
var intro,
    preloader,
    preloaderBar;
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
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
    TweenMax.set("#preloader", { delay: 0.5, display: "none", onComplete: buildScene });
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function buildScene() {

    canvas = document.getElementById("renderCanvas");
    TweenMax.set(canvas, { opacity: 0 });
    TweenMax.to(canvas, 1, { delay: 1, opacity: 1 });

    intro = new DThree({
        canvas: "renderCanvas",
        antialias: true,
        cameraInitialPosition: new THREE.Vector3(3, 3, 40),
        cameraInitialLookAt: new THREE.Vector3(0, 0, 0),
        onResizeResetCameraPositions: false,
        onResizePortraitCameraPosition: new THREE.Vector3(0, 0, 10),
        onResizeLandscapeCameraPosition: new THREE.Vector3(0, 0, 40),
        showStats: true,
        showAxisHelper: true,
        attachControls: true,
        maxPolarAngle: 90,
        minPolarAngle: 0
    });



    var scene = intro.getScene();
    var camera = intro.getCamera();
    var renderer = intro.getRenderer();



    // StarCubemap
    var starField = new THREEx.StarCubemap({ app: intro });
    intro.addToRenderStack(starField.renderFn);
    scene.add(starField.mesh);



    // Shaders
    THREE.VolumetericLightShader = {
        uniforms: {
            tDiffuse: { value: null },
            lightPosition: { value: new THREE.Vector2(0.5, 0.5) },
            exposure: { value: 0.18 },
            decay: { value: 0.95 },
            density: { value: 0.8 },
            weight: { value: 0.4 },
            samples: { value: 50 }
        },

        vertexShader: [
            "varying vec2 vUv;",
            "void main() {",
            "vUv = uv;",
            "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
            "}"
        ].join("\n"),

        fragmentShader: [
            "varying vec2 vUv;",
            "uniform sampler2D tDiffuse;",
            "uniform vec2 lightPosition;",
            "uniform float exposure;",
            "uniform float decay;",
            "uniform float density;",
            "uniform float weight;",
            "uniform int samples;",
            "const int MAX_SAMPLES = 100;",
            "void main()",
            "{",
            "vec2 texCoord = vUv;",
            "vec2 deltaTextCoord = texCoord - lightPosition;",
            "deltaTextCoord *= 1.0 / float(samples) * density;",
            "vec4 color = texture2D(tDiffuse, texCoord);",
            "float illuminationDecay = 1.0;",
            "for(int i=0; i < MAX_SAMPLES; i++)",
            "{",
            "if(i == samples){",
            "break;",
            "}",
            "texCoord -= deltaTextCoord;",
            "vec4 sample = texture2D(tDiffuse, texCoord);",
            "sample *= illuminationDecay * weight;",
            "color += sample;",
            "illuminationDecay *= decay;",
            "}",
            "gl_FragColor = color * exposure;",
            "}"
        ].join("\n")
    };

    THREE.AdditiveBlendingShader = {
        uniforms: {
            tDiffuse: { value: null },
            tAdd: { value: null }
        },

        vertexShader: [
            "varying vec2 vUv;",
            "void main() {",
            "vUv = uv;",
            "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
            "}"
        ].join("\n"),

        fragmentShader: [
            "uniform sampler2D tDiffuse;",
            "uniform sampler2D tAdd;",
            "varying vec2 vUv;",
            "void main() {",
            "vec4 color = texture2D( tDiffuse, vUv );",
            "vec4 add = texture2D( tAdd, vUv );",
            "gl_FragColor = color + add + add;",
            "}"
        ].join("\n")
    };

    THREE.PassThroughShader = {
        uniforms: {
            tDiffuse: { value: null }
        },

        vertexShader: [
            "varying vec2 vUv;",
            "void main() {",
            "vUv = uv;",
            "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
            "}"
        ].join("\n"),

        fragmentShader: [
            "uniform sampler2D tDiffuse;",
            "varying vec2 vUv;",
            "void main() {",
            "gl_FragColor = texture2D( tDiffuse, vec2( vUv.x, vUv.y ) );",
            "}"
        ].join("\n")
    };




    
    var composer, box, pointLight,
        occlusionComposer, occlusionRenderTarget, occlusionBox, lightSphere,
        volumetericLightShaderUniforms,
        DEFAULT_LAYER = 0,
        OCCLUSION_LAYER = 1,
        renderScale = 0.5,
        angle = 0,
        gui = new dat.GUI();




    // Add some lights
    var ambientLight = new THREE.AmbientLight(0x101010); // Dark but dont let things go full black
    scene.add(ambientLight);

    var pointLight = new THREE.PointLight(0xFFFFFF, 1, 100);
    pointLight.position.set(5, 6.5, 6);
    scene.add(pointLight);

    var pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
    scene.add(pointLightHelper);


    // Setup some scene objects (materials, geometries, meshes etc)
    geometry = new THREE.SphereBufferGeometry(1, 16, 16);
    material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    lightSphere = new THREE.Mesh(geometry, material);
    lightSphere.layers.set(OCCLUSION_LAYER);
    scene.add(lightSphere);


    geometry = new THREE.BoxBufferGeometry(1, 1, 1);
    material = new THREE.MeshPhongMaterial({ color: 0xe74c3c });
    box = new THREE.Mesh(geometry, material);
    box.position.z = 2;
    scene.add(box);

    geometry = new THREE.BoxBufferGeometry(1, 1, 1);
    material = new THREE.MeshBasicMaterial({ color: 0x000000 });
    occlusionBox = new THREE.Mesh(geometry, material);
    occlusionBox.position.z = 2;
    occlusionBox.layers.set(OCCLUSION_LAYER);
    scene.add(occlusionBox);



    



    // Setup postprocessing
    var pass;

    occlusionRenderTarget = new THREE.WebGLRenderTarget(window.innerWidth * renderScale, window.innerHeight * renderScale);
    occlusionComposer = new THREE.EffectComposer(renderer, occlusionRenderTarget);
    occlusionComposer.addPass(new THREE.RenderPass(scene, camera));
    pass = new THREE.ShaderPass(THREE.VolumetericLightShader);
    pass.needsSwap = false;
    occlusionComposer.addPass(pass);

    volumetericLightShaderUniforms = pass.uniforms;

    composer = new THREE.EffectComposer(renderer);
    composer.addPass(new THREE.RenderPass(scene, camera));
    pass = new THREE.ShaderPass(THREE.AdditiveBlendingShader);
    pass.uniforms.tAdd.value = occlusionRenderTarget.texture;
    composer.addPass(pass);
    pass.renderToScreen = true;




    intro.addToRenderStack(function () {
        var radius = 2.5,
            xpos = Math.sin(angle) * radius,
            zpos = Math.cos(angle) * radius;

        box.position.set(xpos, 0, zpos);
        box.rotation.x += 0.01;
        box.rotation.y += 0.01;

        occlusionBox.position.copy(box.position);
        occlusionBox.rotation.copy(box.rotation);

        angle += 0.02;
    });



    intro.addToRenderStack(function(){
        camera.layers.set(OCCLUSION_LAYER);
        renderer.setClearColor(0x000000);
        occlusionComposer.render();
    
        camera.layers.set(DEFAULT_LAYER);
        renderer.setClearColor(0x090611);
        composer.render();
    });

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


    preloader.add({ url: "assets/textures/test.png", type: "png" });

    preloader.add({ url: "assets/meshes/AuroraBattleStarText.json", type: "json" });
    preloader.add({ url: "assets/meshes/PirateMothership.json", type: "json" });
    preloader.add({ url: "assets/meshes/DragonYinYang.json", type: "json" });


    preloader.add({ url: "assets/textures/starfield_1.png", type: "image" });
    preloader.add({ url: "assets/textures/starfield_2a.jpg", type: "image" });
    preloader.add({ url: "assets/textures/starfield_2b.png", type: "image" });

    preloader.add({ url: "assets/textures/nebula_03/neb_nx.jpg", type: "image" });
    preloader.add({ url: "assets/textures/nebula_03/neb_px.jpg", type: "image" });
    preloader.add({ url: "assets/textures/nebula_03/neb_ny.jpg", type: "image" });
    preloader.add({ url: "assets/textures/nebula_03/neb_py.jpg", type: "image" });
    preloader.add({ url: "assets/textures/nebula_03/neb_nz.jpg", type: "image" });
    preloader.add({ url: "assets/textures/nebula_03/neb_pz.jpg", type: "image" });


    preloader.add({ url: "includes/js/misc/lodash.min.js", type: "javascript" });

    preloader.add({ url: "includes/js/threejs/three.js", type: "javascript" });
    preloader.add({ url: "includes/js/threejs/controls/OrbitControls.js", type: "javascript" });
    preloader.add({ url: "includes/js/threejs/controls/FlyControls.js", type: "javascript" });
    preloader.add({ url: "includes/js/threejs/Detector.js", type: "javascript" });
    preloader.add({ url: "includes/js/threejs/libs/stats.min.js", type: "javascript" });

    preloader.add({ url: "includes/js/DTools.js", type: "javascript" });
    preloader.add({ url: "includes/js/DThree.js", type: "javascript" });

    preloader.add({ url: "includes/js/threex/THREEX.SphericalStarField.js", type: "javascript" });
    preloader.add({ url: "includes/js/threex/THREEX.StarCubemap.js", type: "javascript" });
    preloader.add({ url: "includes/js/threex/THREEX.DebugCameraPosition.js", type: "javascript" });

    preloader.start();

});