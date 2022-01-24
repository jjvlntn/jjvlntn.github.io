 //////////////////////////////////////////////////////////////////////////////////
        //		Init
        //////////////////////////////////////////////////////////////////////////////////


        var renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            precision: 'mediump',
        });

        var clock = new THREE.Clock();

        var mixers = [];

        renderer.setPixelRatio(window.devicePixelRatio);

        renderer.setClearColor(new THREE.Color('lightgrey'), 0)
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.domElement.style.position = 'absolute'
        renderer.domElement.style.top = '0px'
        renderer.domElement.style.left = '0px'
        console.log(renderer)
        console.log(document.body)
        document.body.appendChild( renderer.domElement );

        // init scene and camera
        var scene = new THREE.Scene();

        //////////////////////////////////////////////////////////////////////////////////
        //		Initialize a basic camera
        //////////////////////////////////////////////////////////////////////////////////

        // Create a camera
        var camera = new THREE.Camera();
        scene.add(camera);

        var light = new THREE.AmbientLight(0xffffff);
        scene.add(light);

        ////////////////////////////////////////////////////////////////////////////////
        //          handle arToolkitSource
        ////////////////////////////////////////////////////////////////////////////////

        var arToolkitSource = new THREEx.ArToolkitSource({
            sourceType : 'webcam',
            sourceWidth: 480,
            sourceHeight: 640,
        })

        arToolkitSource.init(function onReady(){
            // use a resize to fullscreen mobile devices
            setTimeout(function() {
                onResize()
            }, 1000);
        })

        // handle resize
        window.addEventListener('resize', function(){
            onResize()
        })

        // listener for end loading of NFT marker
        window.addEventListener('arjs-nft-loaded', function(ev){
          console.log(ev);
        })

        function onResize(){
            arToolkitSource.onResizeElement()
            arToolkitSource.copyElementSizeTo(renderer.domElement)
            if( arToolkitContext.arController !== null ){
                arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas)
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        //          initialize arToolkitContext
        ////////////////////////////////////////////////////////////////////////////////

        // create atToolkitContext
        var arToolkitContext = new THREEx.ArToolkitContext({
            debug: false,
            detectionMode: 'mono',
            canvasWidth: 480,
            canvasHeight: 640,
        }, {
            sourceWidth: 480,
            sourceHeight: 640,
        })

        // initialize it
        arToolkitContext.init(function onCompleted(){
            // copy projection matrix to camera
            camera.projectionMatrix.copy( arToolkitContext.getProjectionMatrix() );
        })

        ////////////////////////////////////////////////////////////////////////////////
        //          Create a ArMarkerControls
        ////////////////////////////////////////////////////////////////////////////////

        // init controls for camera
        var markerControls = new THREEx.ArMarkerControls(arToolkitContext, camera, {
            type : 'nft',
            descriptorsUrl : 'data/medal',
            changeMatrixMode: 'cameraTransformMatrix',
            smooth: true,
            smoothCount: 100,
            smoothTolance: 0.02,
            smoothThreshold: 5
        })

        var gui = new dat.GUI();
        console.log(markerControls.parameters)
        gui.add(markerControls.parameters , 'smoothCount', 1, 1000);
        gui.add(markerControls.parameters , 'smoothTolerance', 0.01, 0.1);
        gui.add(markerControls.parameters , 'smoothThreshold', 1, 100);
        


        scene.visible = false

        var root = new THREE.Object3D();
        scene.add(root);
        var smoothedControls = smoothedControls = new THREEx.ArSmoothedControls(root, {
            lerpPosition: 0.8,
            lerpQuaternion: 0.8,
            lerpScale: 1,
            // minVisibleDelay: 1,
            // minUnvisibleDelay: 1,
        });

        //////////////////////////////////////////////////////////////////////////////////
        //		add an object in the scene
        //////////////////////////////////////////////////////////////////////////////////

        var threeGLTFLoader = new THREE.GLTFLoader();
        var model;

        threeGLTFLoader.load("./data/medal-light-90.glb", function (gltf) {
            model = gltf.scene.children[0];
            lights = gltf.scene.children[1];
            model.name = 'medal';
            console.log(gltf.scene);
            console.log(gltf.scene.children[1]);
            console.log(model);
            // var animation = gltf.animations[0];
            // var mixer = new THREE.AnimationMixer(model);
            // mixers.push(mixer);
            // var action = mixer.clipAction(animation);
            // action.play();

            root.matrixAutoUpdate = false;
            root.add(lights)
            root.add(model);


            model.position.z = 0;
            model.position.x = 0;
            model.position.y = 0;

            gui.add(model.position, 'x', -1000 , 1000);
            gui.add(model.position, 'y', -1000 , 1000);
            gui.add(model.position, 'z', -1000 , 1000);


            //////////////////////////////////////////////////////////////////////////////////
            //		render the whole thing on the page
            //////////////////////////////////////////////////////////////////////////////////

            var animate = function() {
                requestAnimationFrame(animate);

                if (mixers.length > 0) {
                    for (var i = 0; i < mixers.length; i++) {
                        mixers[i].update(clock.getDelta());
                    }
                }

                if (!arToolkitSource.ready) {
                    return;
                }

                arToolkitContext.update( arToolkitSource.domElement )

                // update scene.visible if the marker is seen
                scene.visible = camera.visible;

                renderer.render(scene, camera);
            };

            requestAnimationFrame(animate);
        }
    );