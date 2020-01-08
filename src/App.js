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
      var camera, controls, scene, renderer;
      init();
      //render(); // remove when using next line for animation loop (requestAnimationFrame)
      animate();
      function init() {
        scene = new THREE.Scene();
        scene.background = new THREE.Color( 0xcccccc );
        scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );
        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.getElementById("three-map").appendChild( renderer.domElement );
        camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
        camera.position.set( 400, 200, 0 );
        // controls
        controls = new OrbitControls( camera, renderer.domElement );
        //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
        controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        controls.minDistance = 100;
        controls.maxDistance = 500;
        controls.maxPolarAngle = Math.PI / 2;
        // world
        var geometry = new THREE.CylinderBufferGeometry( 0, 10, 30, 4, 1 );
        var material = new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } );
        for ( var i = 0; i < 500; i ++ ) {
          var mesh = new THREE.Mesh( geometry, material );
          mesh.position.x = Math.random() * 1600 - 800;
          mesh.position.y = 0;
          mesh.position.z = Math.random() * 1600 - 800;
          mesh.updateMatrix();
          mesh.matrixAutoUpdate = false;
          scene.add( mesh );
        }
        // lights
        var light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 1, 1, 1 );
        scene.add( light );
        var light = new THREE.DirectionalLight( 0x002288 );
        light.position.set( - 1, - 1, - 1 );
        scene.add( light );
        var light = new THREE.AmbientLight( 0x222222 );
        scene.add( light );
        //
        window.addEventListener( 'resize', onWindowResize, false );
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
