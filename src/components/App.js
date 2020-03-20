import React,{ useState,useEffect } from 'react';
import './App.css';
import { connect } from "react-redux";
import * as THREE from 'three';
import {ThemeliodesProblima_2} from "../helpers/ThemeliodiProblimata"
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
import createWorld from "../helpers/createWorld";
import SplitPane from 'react-split-pane';
import Modal from "react-modal";
import LayerPanel from "./LayerPanel"
import {setModelRuntimeInfo,loadVector,loadModel,changeSection,setScene,setLayers,setPlane} from "../actions";
import readXlsxFile from 'read-excel-file';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import * as XLSX from 'xlsx';

import ModelList from "./ModelList";
import Ground from "./Ground";
Modal.setAppElement('#root')

function App(props) {
  const allClasses = (name) => {
    if(name === "models" ){
      return <ModelList />
    } else if(name === "vertices" ){
      return <Ground />
    } else {
      return <span></span>;
    }
  };
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [files, setFiles] = useState([])
  const [elements, setElements] = useState({
    mixers:[], camera:{}, controls:{}, scene:{}, renderer:{},pointer:{}, partials:{},loaders:{},onWindowResize:()=>{}
  })
  const toggleModal = ()=>setModalOpen(!modalOpen);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  const  loadGLTFModel = file => {
    const {name,size} = file[0];
    const {scene,loaders} = elements;

    const loader = new loaders.GLTFLoader();
    var dracoLoader = new DRACOLoader();
    loader.setDRACOLoader( dracoLoader );

    loader.load2(file, gltf => {
         // var scene = gltf.scene;

          // model.animations = gltf.animations;
          // model.scene = scene;

          // Enable Shadows

          gltf.scene.traverse( function ( object ) {

            if ( object.isMesh ) {

              object.castShadow = true;

            }

          } );
        props.loadModel({name,size,object:gltf});
        setModalOpen(!modalOpen);       
        const newLayers = JSON.parse(JSON.stringify(props.layers));
        newLayers[0].children.push({ key: `0-${newLayers[0].children.length}`, title: name, checkable:false,selectable:false})
        props.setLayers(newLayers);       

      });
  }   
  const  loadFBXModel = file => {
    const {name,size} = file[0];
    const {scene,loaders} = elements;

    const loader = new loaders.FBXLoader();
    
    loader.load2(file, object => {
        console.log(object.animations)
        // if(object.animations.length > 0) {
        //   elements.mixer = new THREE.AnimationMixer( object );
        //   var action = elements.mixer.clipAction( object.animations[ 0 ] );
        //   action.play();  
        // }
        
        object.traverse( child => {
          if ( child.isMesh ) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        } );
        props.loadModel({name,size,object});
        setModalOpen(!modalOpen);       
        const newLayers = JSON.parse(JSON.stringify(props.layers));
        newLayers[0].children.push({ key: `0-${newLayers[0].children.length}`, title: name, checkable:false,selectable:false})
        props.setLayers(newLayers);       

      });
  }
  useEffect(()=>{
      let {mixers,camera,controls,scene,renderer,pointer,partials,loaders} = elements;
      const rendererContainer = document.getElementById("three-map");
      const newWorld = createWorld(camera,controls,scene,renderer,pointer,partials,loaders,rendererContainer,mixers,props.setModelRuntimeInfo);
      props.setScene(newWorld.scene);
      props.setPlane({id:Date.now(),mesh:newWorld.partials.plane});
      setElements({...newWorld});
  },[])
  return (
    <div className="App">
      <header className="App-header">
        <Navbar expand="md" className="navbar navbar-dark">
          <NavbarBrand href="/"><div className="logo-container"><div className="logo"/>Mergin' Mode</div></NavbarBrand>
          <NavbarToggler onClick={toggleMenu} />
          <Collapse isOpen={menuOpen} navbar>
            <Nav className="mr-auto" navbar>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  File
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem onClick = {toggleModal}>
                    <span>Import </span>
                  </DropdownItem>
                  <DropdownItem divider />
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
            <NavbarText>
                <NavLink href="https://github.com/prieston/mergin_mode" target="_blank">
                <i class="fab fa-github"></i>
                <span>GitHub</span>
                </NavLink>
            </NavbarText>
          </Collapse>
        </Navbar>
      </header>
      <main>
      <SplitPane split="vertical" minSize={50} maxSize={-50} defaultSize={"40%"} onChange={elements.onWindowResize}>
        <LayerPanel />
        <SplitPane split="horizontal" minSize={50} maxSize={-50} defaultSize={"60%"} onChange={elements.onWindowResize}>
          <div id = "three-map" />
          {props.section!== null && allClasses(props.section)}
        </SplitPane>
      </SplitPane>
        

      </main>
      <Modal
        isOpen={modalOpen}
        onRequestClose={()=>setModalOpen(!modalOpen)}
      >
        <div className="container form">
          <div className="row">
            <div className="col-sm-12">
              <input className="form-control" type="file" onChange={e => {
              setFiles([...e.target.files]);
            }}/>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6">
              <button className="btn btn-primary form-control" onClick={()=>{
                const extention = files[0].name.split(".")[files[0].name.split(".").length - 1];
                const vectorExt = ["xlsx","xls","ods","csv","xyz"];
                if (vectorExt.indexOf(extention) > -1) {
                  const reader = new FileReader();
                  const rows= [];
                  reader.onload = (evt) => { // evt = on_file_select event
                      /* Parse data */
                      const bstr = evt.target.result;
                      const wb = XLSX.read(bstr, {type:'binary'});
                      /* Get first worksheet */
                      const wsname = wb.SheetNames[0];
                      const ws = wb.Sheets[wsname];
                      /* Convert array of arrays */
                      const data = XLSX.utils.sheet_to_csv(ws, {header:1});
                      /* Update state */
                      rows.push(data.split("\n").map(v=>v.split(",").filter(v=>v.length > 0).map(n=>Number(n))));

                      const {name,size} = files[0];
                      const newLayers = JSON.parse(JSON.stringify(props.layers));
                      newLayers[1].children[2].children.push({ key: `1-2-${newLayers[1].children[2].children.length}`, title: name, checkable:false,selectable:false})
                      props.setLayers(newLayers);
                      if(name.includes("anime")){
                        for(let i=0;i< rows[0].length - 1;i++) {
                          const Xa = rows[0][i][0]; 
                          const Ya = rows[0][i][1];
                          const Xb = (rows[0][i + 1] || [])[0] || 0; 
                          const Yb = (rows[0][i + 1] || [])[1] || 0; 
                          const {Gab,Sab} = ThemeliodesProblima_2(Xa,Ya,Xb,Yb)
                          rows[0][i][3] = Number(Gab);
                          rows[0][i][4] = Number(Sab);
                        }
                        props.loadVector({name,size,array:rows});
                      } else {
                        props.loadVector({name,size,array:rows});
                      }
                  };
                  reader.readAsBinaryString(files[0]);
                  setModalOpen(!modalOpen);       
                  
                 
                } else if(extention == "fbx") {
                  loadFBXModel(files);
                } else if (extention === "glb" || extention === "gltf") {
                  loadGLTFModel(files);
                }
                console.log(vectorExt)
              }}>Load</button>
            </div>
            <div className="col-sm-6">
              <button className="btn btn-secondary form-control" onClick={toggleModal}>Close</button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}


const mapStateToProps = state => {
  return {
    section:state.api.section.active,
    title:state.api.section.title,
    layers:state.api.layers,
    vectors: state.api.vectors,
    modelLayer:state.api.modelLayer
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadModel:model =>dispatch(loadModel(model)),
    loadVector:vector =>dispatch(loadVector(vector)),
    changeSection:section => dispatch(changeSection(section)),
    setScene:scene => dispatch(setScene(scene)),
    setPlane:plane => dispatch(setPlane(plane)),
    setLayers:layers => dispatch(setLayers(layers)),
    setModelRuntimeInfo:(modelId,info) => dispatch(setModelRuntimeInfo(modelId,info))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);


// function instantiateUnits() {

//         var numSuccess = 0;

//         for ( var i = 0; i < UNITS.length; ++ i ) {

//           var u = UNITS[ i ];
//           var model = getModelByName( u.modelName );

//           if ( model ) {

//             var clonedScene = SkeletonUtils.clone( model.scene );

//             if ( clonedScene ) {

//               // THREE.Scene is cloned properly, let's find one mesh and launch animation for it
//               var clonedMesh = clonedScene.getObjectByName( u.meshName );

//               if ( clonedMesh ) {

//                 var mixer = startAnimation( clonedMesh, model.animations, u.animationName );

//                 // Save the animation mixer in the list, will need it in the animation loop
//                 mixers.push( mixer );
//                 numSuccess ++;

//               }

//               // Different models can have different configurations of armatures and meshes. Therefore,
//               // We can't set position, scale or rotation to individual mesh objects. Instead we set
//               // it to the whole cloned scene and then add the whole scene to the game world
//               // Note: this may have weird effects if you have lights or other items in the GLTF file's scene!
//               worldScene.add( clonedScene );

//               if ( u.position ) {

//                 clonedScene.position.set( u.position.x, u.position.y, u.position.z );

//               }

//               if ( u.scale ) {

//                 clonedScene.scale.set( u.scale, u.scale, u.scale );

//               }

//               if ( u.rotation ) {

//                 clonedScene.rotation.x = u.rotation.x;
//                 clonedScene.rotation.y = u.rotation.y;
//                 clonedScene.rotation.z = u.rotation.z;

//               }

//                   }

//           } else {

//             console.error( "Can not find model", u.modelName );

//           }

//         }

//         console.log( `Successfully instantiated ${numSuccess} units` );

//       }