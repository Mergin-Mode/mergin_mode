import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {CalculateDeltaPosition} from "./CalculateDeltaPosition";
import {calculateSab} from "./ThemeliodiProblimata";
        // var modelName = "models/gltf/" + model.name + ".glb";

GLTFLoader.prototype.load2 = function(files, callback) {
    var scope = this;
    var file = files[0];

    var reader = new FileReader();
    
    reader.onload = function(event) {
        if (event.target.readyState === 2 || event.target.status === 0) {
            scope.parse(event.target.result || event.target.responseText,"",callback);
            // if (callback)
            //     callback(gltf);

        } else {

            // scope.dispatchEvent({type: 'error', message: 'Couldn\'t load URL [' + url + ']', response: event.target.readyState});

        }
    };
    reader.readAsArrayBuffer(file);

};
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

export default function	createWorld(camera,controls,scene,renderer,pointer,partials,loaders,rendererContainer, mixer,setModelRuntimeInfo) {
      loaders.FBXLoader = FBXLoader;
    	loaders.GLTFLoader = GLTFLoader;
    	var clock = new THREE.Clock();
      var raycaster = new THREE.Raycaster();
      var mouse = new THREE.Vector2();

        const host = document.getElementById("three-map");
        const axesHost = document.getElementById("axes-helper");
      // init();
      //render(); // remove when using next line for animation loop (requestAnimationFrame)

        
        const generateTerrain = (g /*,m, e*/) => {
          const pos = g.getAttribute("position");
          const pa = pos.array;

          // const hVerts = g.parameters.width;
          // const wVerts = g.parameters.height;
          // for (let j = 0; j < hVerts; j++) {
          //   for (let i = 0; i < wVerts; i++) {
          //     pa[3 * (j * wVerts + i) + 2] = 300
              
          //   }
          // }
          for (let j = 2,i=0; j < pa.length; j+=3,i++) {
              pa[j] = 0;
          }
          pos.needsUpdate = true;
          g.computeVertexNormals();
        };


        scene = new THREE.Scene();
        const AxesScene = new THREE.Scene();
        scene.background = new THREE.Color( 0x000000 );
        // scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );
        renderer = new THREE.WebGLRenderer( { antialias: true,alpha:true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setClearColor( 0x000000, 0 );
        renderer.setSize( host.clientWidth, host.clientHeight );

        const renderer2 = new THREE.WebGLRenderer( { antialias: true,alpha:true } );
        renderer2.setPixelRatio( window.devicePixelRatio );
        renderer2.setClearColor( 0x000000, 0 )
        renderer2.setSize( axesHost.clientWidth, axesHost.clientHeight );


        host.appendChild( renderer.domElement );
        axesHost.appendChild( renderer2.domElement );
        camera = new THREE.PerspectiveCamera( 60, host.clientWidth / host.clientHeight, 1, 10000 );
        // camera = new THREE.OrthographicCamera( host.clientWidth/-2,host.clientWidth/2,host.clientHeight/2,host.clientHeight/-2, 1, 10000 );
        camera.position.set( 80, 80, 80 );
        camera.up.set(0,0,1);

        // controls = new TrackballControls( camera, renderer.domElement );
        controls = new OrbitControls( camera, renderer.domElement );
        //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
        controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        controls.minDistance = 1;
        controls.maxDistance = 1000;
        controls.maxPolarAngle = Math.PI / 2;

        

        const camera2 = new THREE.PerspectiveCamera( 60, axesHost.clientWidth / axesHost.clientHeight, 1, 10000 );
        // const camera2 = new THREE.OrthographicCamera( axesHost.clientWidth/-2,axesHost.clientWidth/2,axesHost.clientHeight/2,axesHost.clientHeight/-2, 1, 10000 );
        // camera2.position.sub( camera.position,controls2.target );
        camera2.position.set(6,6,6);
        camera2.lookAt( AxesScene.position );

        const controls2 = new OrbitControls( camera2, renderer.domElement );
        //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
        controls2.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
        controls2.dampingFactor = 0.05;
        controls2.screenSpacePanning = false;
        controls2.maxPolarAngle = Math.PI / 2;
        controls2.enablePan = false;
        controls2.enableZoom = false;
        controls2.update();

        // world
        var geometry = new THREE.PlaneBufferGeometry( 100, 100, 99, 99 );
        generateTerrain(geometry)        

        var material = new THREE.MeshPhongMaterial( {color: "#222", side: THREE.DoubleSide} );

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
        

        // var lhelper = new THREE.DirectionalLightHelper( light, 5 );
        // scene.add( lhelper );

        var axesHelper = new THREE.AxesHelper( 5 );
        AxesScene.add( axesHelper );
        var light = new THREE.DirectionalLight( 0x002288 );
        light.position.set( - 0, - 0, - 100 );
        scene.add( light );


        // var lhelper = new THREE.DirectionalLightHelper( light, 5 );
        // scene.add( lhelper );        

        var light = new THREE.AmbientLight( 0x666666 );
        scene.add( light );


        var geometry = new THREE.SphereGeometry( 1, 32, 32 );
        var material = new THREE.MeshBasicMaterial( {color: 0xff0000} );
        pointer = new THREE.Mesh( geometry, material );
        // scene.add( pointer );

        var geometry = new THREE.SphereGeometry( 150, 32, 32 );
        var loader = new THREE.TextureLoader();
        loader.crossOrigin = "";
        var geometry = new THREE.SphereGeometry( 150, 32, 32 );
        var material = new THREE.MeshBasicMaterial({opacity: 0,
          transparent: true,
          alphaTest: 0.05,
          side: THREE.DoubleSide
        });
        const sky = new THREE.Mesh( geometry, material );
        sky.rotation.set(Math.PI/2,0,0)
        scene.add(sky)  

        // loader.load(src,
        //       function( texture ) {
        //         sky.rotation.set(Math.PI/2,0,0)
        //         sky.material = new THREE.MeshBasicMaterial( { map: texture, side: THREE.BackSide } );
        //         sky.material.needsUpdate = true;
        //         // props.scene.add(props.sky)  
        //       },
        //       function () {},  // onProgress function
        //       function ( error ) { console.log( error ) } // onError function
        //   );
    

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
        mouse.x = ( (event.clientX-left) / host.clientWidth ) * 2 - 1;
        mouse.y = - ( (event.clientY - top) / host.clientHeight ) * 2 + 1;

        raycaster.setFromCamera( mouse, camera );

        // See if the ray from the camera into the world hits one of our meshes
        var intersects = raycaster.intersectObject( plane );

        // Toggle rotation bool for meshes that we clicked
        if ( intersects.length > 0 ) {

          pointer.position.set( 0, 0, 0 );
          pointer.lookAt( intersects[ 0 ].face.normal );

          pointer.position.copy( intersects[ 0 ].point );
        }
          // console.log(pointer.position)

      }
      function onWindowResize() {
        camera.aspect = host.clientWidth / host.clientHeight;
        camera.updateProjectionMatrix();
        camera2.updateProjectionMatrix();
        renderer.setSize( host.clientWidth, host.clientHeight );
      }

      function animate() {
        // setTimeout( function() {
        requestAnimationFrame( animate );
        // }, 1000 / 60 );
        controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
        controls2.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
        render();
      }

      function render() {
        var delta = clock.getDelta();

        for ( var i = 0; i < window.mergin_mode.mixers.length; ++ i ) {

          window.mergin_mode.mixers[ i ].update( delta );

        }
        window.mergin_mode.modelLayer.map(model => {
          const {x,y,z} = model.mesh.position;
          const {animating,activeRow} = model.runtimeInfo;
          const activeRowData = window.mergin_mode.vectors.data.filter(v=>v.id == model.vectorId)[0].array[0][activeRow];
          const xStart = activeRowData[0];
          const yStart = activeRowData[1];
          const zStart = activeRowData[2];
          const Gab = activeRowData[3];
          const Sab = activeRowData[4];
          if(
            animating &&
            typeof x !== "undefined" &&
            typeof y !== "undefined" &&
            typeof z !== "undefined"
            ) {
            const dem =window.mergin_mode.plane.dem;
            const {x:newX,y:newY,z:newZ} = CalculateDeltaPosition(Number(x.toFixed(4)),Number(y.toFixed(4)),Number(z.toFixed(4)),Gab,delta,dem);
            let newSab = calculateSab(xStart,yStart,x,y);
            if(newSab === Infinity){
              newSab = 0
            }
            if(newSab < Sab){
              model.mesh.position.set(newX,newY,newZ)  
            } else {
              const newActiveRow = window.mergin_mode.vectors.data.filter(v=>v.id == model.vectorId)[0].array[0][activeRow + 1];
              if(!newActiveRow) {
                  const startActiveRow = window.mergin_mode.vectors.data.filter(v=>v.id == model.vectorId)[0].array[0][0];

                  model.mesh.position.set(startActiveRow[0],startActiveRow[1],startActiveRow[2]);
                  setModelRuntimeInfo(model.id,{animating:false,activeRow:0})
              } else {
                  model.mesh.position.set(newActiveRow[0],newActiveRow[1],newActiveRow[2]);
                  setModelRuntimeInfo(model.id,{animating:true,activeRow:activeRow + 1})
                  // model.mesh.rotation.set(model.mesh.rotation.x,model.mesh.rotation.y,newActiveRow[3]/63.6619772367581)
                  // model.mesh.rotation.y = (-newActiveRow[3] + 200)/63.6619772367581
                  // const axisX = new Vector3(1, 0, 0);
                  // const axisY = new Vector3(0, 1, 0);
                  const axisZ = new THREE.Vector3(0, 0, 1);
                  // mesh.rotateOnWorldAxis(axisX, rot.x);
                  // mesh.rotateOnWorldAxis(axisY, rot.y);
                  model.mesh.rotateOnWorldAxis(axisZ, -(400 - activeRowData[3] + newActiveRow[3])/63.6619772367581);
              }
            }
            
          }
        })
        renderer.render( scene, camera );
        renderer2.render( AxesScene, camera2 );
      }

      animate();
       
      window.addEventListener( 'resize', onWindowResize, false );
      document.getElementById("three-map").addEventListener( 'click', onMouseMove, false );

      partials = {plane,pointer,sky};
      return {camera,controls,scene,renderer,pointer,partials,loaders,onWindowResize}
} 