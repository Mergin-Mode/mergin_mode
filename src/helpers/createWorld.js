import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

FBXLoader.prototype.load2 = function(files, callback) {
    var scope = this;
    var file = files[0];

    var reader = new FileReader();

    reader.onload = function(event) {
        if (event.target.readyState === 2 || event.target.status === 0) {
            var geometry = scope.parse(event.target.result || event.target.responseText);

            if (callback)
                callback(geometry);

        } else {

            // scope.dispatchEvent({type: 'error', message: 'Couldn\'t load URL [' + url + ']', response: event.target.readyState});

        }
    };

    reader.readAsArrayBuffer(file);

};

export default function	createWorld(camera,controls,scene,renderer,pointer,partials,loaders,rendererContainer) {
	loaders.FBXLoader = FBXLoader;
	var clock = new THREE.Clock();
      var raycaster = new THREE.Raycaster();
      var mouse = new THREE.Vector2();

      // init();
      //render(); // remove when using next line for animation loop (requestAnimationFrame)

        
        const generateTerrain = (g /*,m, e*/) => {
          const pos = g.getAttribute("position");
          const pa = pos.array;

          const hVerts = g.parameters.width;
          const wVerts = g.parameters.height;
          for (let j = 0; j < hVerts; j++) {
            for (let i = 0; i < wVerts; i++) {
              pa[3 * (j * wVerts + i) + 2] = /*Math.random()*/0 
            }
          }
          pos.needsUpdate = true;
          g.computeVertexNormals();
        };


        scene = new THREE.Scene();
        scene.background = new THREE.Color( 0x0000ff );
        // scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );
        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.shadowMap.enabled = true;



        document.getElementById("three-map").appendChild( renderer.domElement );
        camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
        camera.position.set( 20, 20, 20 );
        camera.up.set(0,0,1);
        // controls
        controls = new OrbitControls( camera, renderer.domElement );
        //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
        controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        controls.minDistance = 10;
        controls.maxDistance = 500;
        controls.maxPolarAngle = Math.PI / 2;
        // world
        var geometry = new THREE.PlaneBufferGeometry( 1000, 1000, 100, 100 );
        generateTerrain(geometry)        

        var material = new THREE.MeshPhongMaterial( {color: 0xffff00, side: THREE.DoubleSide} );

        material.flatShading = true

        const plane = new THREE.Mesh( geometry, material );
        plane.position.set( 0, 0, 0 );

        plane.castShadow = true;
        plane.receiveShadow = true;

        // var geometry = new THREE.SphereGeometry( 1, 32, 32 );
        // var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        // helper = new THREE.Mesh( geometry, material );
        // scene.add( helper );

        scene.add( plane );


        // var geometry = new THREE.CylinderBufferGeometry( 0, 10, 30, 4, 1 );
        // var material = new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } );
        // for ( var i = 0; i < 500; i ++ ) {
        //   var mesh = new THREE.Mesh( geometry, material );
        //   mesh.position.x = Math.random() * 1600 - 800;
        //   mesh.position.y = 0;
        //   mesh.position.z = Math.random() * 1600 - 800;
        //   mesh.updateMatrix();
        //   mesh.matrixAutoUpdate = false;
        //   scene.add( mesh );
        // }
        // lights
        var light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 1, 1, 100 );
        light.shadow = {
          camera: {
            near: 0.5,
            far: 300,
            left: -50,
            bottom: -50,
            right: 50,
            top: 50
          },
          bias: 0.0001,
          mapSize: { x: 1024 * 6, y: 1024 * 6 }
        };
        scene.add( light );
        

        var lhelper = new THREE.DirectionalLightHelper( light, 5 );
        scene.add( lhelper );

        var light = new THREE.DirectionalLight( 0x002288 );
        light.position.set( - 0, - 0, - 100 );
        scene.add( light );


        var lhelper = new THREE.DirectionalLightHelper( light, 5 );
        scene.add( lhelper );        

        var light = new THREE.AmbientLight( 0x666666 );
        scene.add( light );


        var geometry = new THREE.SphereGeometry( 1, 32, 32 );
        var material = new THREE.MeshBasicMaterial( {color: 0xff0000} );
        pointer = new THREE.Mesh( geometry, material );
        scene.add( pointer );

        // var geometry = new THREE.SphereGeometry( 1, 32, 32 );
        // var material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
        // var test = new THREE.Mesh( geometry, material );
        // scene.add( test );

        function onMouseMove( event ) {
        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components
        const el = document.getElementById("three-map").getBoundingClientRect()
        const left = el.left;
        const top = el.top;
        mouse.x = ( (event.clientX-left) / window.innerWidth ) * 2 - 1;
        mouse.y = - ( (event.clientY - top) / window.innerHeight ) * 2 + 1;

        raycaster.setFromCamera( mouse, camera );

        // See if the ray from the camera into the world hits one of our meshes
        var intersects = raycaster.intersectObject( plane );

        // Toggle rotation bool for meshes that we clicked
        if ( intersects.length > 0 ) {

          pointer.position.set( 0, 0, 0 );
          pointer.lookAt( intersects[ 0 ].face.normal );

          pointer.position.copy( intersects[ 0 ].point );

        }

}
      function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
      }

      function animate() {
        requestAnimationFrame( animate );
        controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
        render();
      }

      function render() {
        // var delta = clock.getDelta();

        // if ( mixer ) mixer.update( delta );
        renderer.render( scene, camera );
      }

      animate();
       
      window.addEventListener( 'resize', onWindowResize, false );
      window.addEventListener( 'mousedown', onMouseMove, false );

      partials = {plane,pointer};
      return {camera,controls,scene,renderer,pointer,partials,loaders}
} 