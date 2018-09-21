/*
 * Author: Darcey@AllForTheCode.co.uk
 * Version: 1.0
*/

/*

Get direction of object
var zVec = new THREE.Vector3( 0, 0, 1 );
zVec.applyQuaternion( object.quaternion );

https://stackoverflow.com/questions/14167962/how-to-derive-standard-rotations-from-three-js-when-using-quaternions

Vector3.setEulerFromQuaternion( q, eulerOrder);

rotation.axisToQuaternion(yaw,vec3)
Math.clamp


*/

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
var THREEx = THREEx || {}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
THREEx.DebugCameraPosition = function () {

    var me = this;

    var params = {
        a: false,
        s: false,
        d: false,
        q: false,
        e: false,
        space: false,
        esc: false,
        up: false,
        down: false,
        left: false,
        right: false,
        np7: false,
        np8: false,
        np9: false,
        np4: false,
        np5: false,
        np6: false,
        npPlus: false,
        npMinus: false,
        camera: null,
        default: new THREE.Vector3(0, 0, 20),
        step: 0.01
    };

    // Process arguments
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    if (arguments[0] && typeof (arguments[0]) == "object") {

        for (var key in arguments[0]) {
            if (arguments[0].hasOwnProperty(key)) {
                params[key] = arguments[0][key];
            }
        }
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    window.addEventListener("keydown", function (e) {
        if (e.defaultPrevented) {
            return;
        }

        switch (e.key) {
            case "ArrowUp":
                params.up = true;
                if (params.camera) {
                    params.camera.rotation.x += params.step;
                }
                break;
            case "ArrowDown":
                params.down = true;
                if (params.camera) {
                    params.camera.rotation.x -= params.step;
                }
                break;
            case "ArrowLeft":
                params.left = true;
                if (params.camera) {
                    params.camera.rotation.z -= params.step;
                }
                break;
            case "ArrowRight":
                params.right = true;
                if (params.camera) {
                    params.camera.rotation.z += params.step;
                }
                break;



            case "Enter":

                break;
            case "Escape":
                if (params.camera) {
                    params.camera.position.x = params.default.x;
                    params.camera.position.y = params.default.y;
                    params.camera.position.z = params.default.z;
                    params.camera.rotation.x = params.default.x;
                    params.camera.rotation.y = params.default.y;
                    params.camera.rotation.z = params.default.z;
                    params.camera.lookAt(new THREE.Vector3(0, 0, 0));
                }
                break;


            case " ":
                log(params.camera.position);
                log(params.camera.rotation);
                break;



            case "q":
                params.q = true;
                if (params.camera) {
                    params.camera.position.y -= params.step;
                }
                break;
            case "w":
                params.w = true;
                if (params.camera) {
                    //params.camera.position.z -= params.step;
                    var direction = params.camera.getWorldDirection();
                    direction = direction.multiplyScalar(params.step);
                    params.camera.position.add(direction);
                }
                break;
            case "e":
                params.e = true;
                if (params.camera) {
                    params.camera.position.y += params.step;
                }
                break;
            case "a":
                params.a = true;
                if (params.camera) {
                    params.camera.position.x -= params.step;
                }
                break;
            case "s":
                params.s = true;
                if (params.camera) {
                    //params.camera.position.z += params.step;
                    var direction = params.camera.getWorldDirection();
                    direction = direction.multiplyScalar(params.step);
                    params.camera.position.sub(direction);
                }
                break;
            case "d":
                params.d = true;
                if (params.camera) {
                    params.camera.position.x += params.step;
                }
                break;





            case "6":
                params.q = true;
                if (params.camera) {
                    params.camera.rotation.y -= params.step;
                }
                break;
            case "9"://
                params.w = true;
                if (params.camera) {
                    params.camera.rotation.z -= params.step;
                }
                break;
            case "4":
                params.e = true;
                if (params.camera) {
                    params.camera.rotation.y += params.step;
                }
                break;
            case "5"://
                params.a = true;
                if (params.camera) {
                    params.camera.rotation.x -= params.step;
                }
                break;
            case "7"://
                params.s = true;
                if (params.camera) {
                    params.camera.rotation.z += params.step;
                }
                break;
            case "8"://
                params.d = true;
                if (params.camera) {
                    params.camera.rotation.x += params.step;
                }
                break;



            case "-":
                params.step -= 0.01;
                log(params.step);

                break;
            case "+":
                params.step += 0.01;
                log(params.step);
                break;



            default:
                log(e.key);
                return;
        }

        e.preventDefault();
    }, true);


}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -