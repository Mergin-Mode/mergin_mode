import React,{ useState,useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText
} from 'reactstrap';
import SplitPane from 'react-split-pane';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

function App() {
   const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);
  useEffect(()=>{

   

      var camera, controls, scene, renderer,helper,plane;
      var raycaster = new THREE.Raycaster();
      var mouse = new THREE.Vector2();

      init();
      //render(); // remove when using next line for animation loop (requestAnimationFrame)
      animate();

      function init() {

        
const generateTerrain = (g /*,m, e*/) => {
  const pos = g.getAttribute("position");
  const pa = pos.array;

  const hVerts = g.parameters.width;
  const wVerts = g.parameters.height;
  let prev = 0;
  for (let j = 0; j < hVerts; j++) {
    for (let i = 0; i < wVerts; i++) {
      Math.random() > 0.5 ? (pa[3 * (j * wVerts + i) + 2] = prev + Math.random() * 3) :
      (pa[3 * (j * wVerts + i) + 2] = prev - Math.random() * 3) ;
      prev = pa[3 * (j * wVerts + i) + 2];
    }
  }
  pos.needsUpdate = true;
  g.computeVertexNormals();
};


        scene = new THREE.Scene();
        // scene.background = new THREE.Color( 0xffffff );
        // scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );
        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.shadowMap.enabled = true;



        document.getElementById("three-map").appendChild( renderer.domElement );
        camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.set( 2000, 2000, 400 );
        camera.up.set(0,0,1);
        // controls
        controls = new OrbitControls( camera, renderer.domElement );
        //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
        controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        controls.minDistance = 100;
        // controls.maxDistance = 500;
        controls.maxPolarAngle = Math.PI / 2;
        // world
        var geometry = new THREE.PlaneBufferGeometry( 1000, 1000, 100, 100 );
        generateTerrain(geometry)        

        var material = new THREE.MeshPhongMaterial( {color: 0xffff00, side: THREE.DoubleSide} );

        material.flatShading = true

        plane = new THREE.Mesh( geometry, material );
        plane.position.set( 0, 0, 0 );

        plane.castShadow = true;
        plane.receiveShadow = true;

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
        light.position.set( 1000, 1000, 1000 );
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


        var geometry = new THREE.SphereGeometry( 5, 32, 32 );
        var material = new THREE.MeshBasicMaterial( {color: 0xff0000} );
        helper = new THREE.Mesh( geometry, material );
        scene.add( helper );

        //
        window.addEventListener( 'resize', onWindowResize, false );
        window.addEventListener( 'mousemove', onMouseMove, false );

      }

       

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

          helper.position.set( 0, 0, 0 );
          helper.lookAt( intersects[ 0 ].face.normal );

          helper.position.copy( intersects[ 0 ].point );

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
        renderer.render( scene, camera );
      }
  })
  return (
    <div className="App">
      <header className="App-header">
        <Navbar color="dark" light expand="md">
          <NavbarBrand href="/">3DRW</NavbarBrand>
          <NavbarToggler onClick={toggle} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="mr-auto" navbar>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  File
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem>
                    New
                  </DropdownItem>
                  <DropdownItem>
                    Open
                  </DropdownItem>
                  <DropdownItem divider />
                </DropdownMenu>
              </UncontrolledDropdown>
              <NavItem>
                <NavLink href="https://github.com/reactstrap/reactstrap">GitHub</NavLink>
              </NavItem>
            </Nav>
            <NavbarText>3drw</NavbarText>
          </Collapse>
        </Navbar>
      </header>
      <main>
        <SplitPane split="horizontal" minSize={50} defaultSize={500}>
          <div>
            <SplitPane split="vertical" minSize={50} defaultSize={100}>
              <div />
              <div id = "three-map" />
            </SplitPane>
          </div>
          <div />
        </SplitPane>

      </main>
    </div>
  );
}

export default App;
