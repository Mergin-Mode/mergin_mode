import React,{ useState,useEffect } from 'react';
import './App.css';
import { connect } from "react-redux";
import * as THREE from 'three';
// import {loadModels, addModels} from "../helpers/demo";
import DropZone from "./layout/DropZone";
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
import {setModelLayer,setModelRuntimeInfo,loadVector,loadModel,changeSection,setKeys,setScene,setLayers,setPlane,setSky,showCoords,addModel,loadDemo,loadGround} from "../actions";
import readXlsxFile from 'read-excel-file';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import * as XLSX from 'xlsx';

import ModelList from "./ModelList";
import Background from "./Background";
import Ground from "./Ground";
import Images from "./Images";
import Color from "./Color";
Modal.setAppElement('#root')

function App(props) {
  const allClasses = (name) => {
    if(name === "models" ){
      return <ModelList />
    } else if(name === "background" ){
      return <Background />
    } 
    else if(name === "background-color" ){
      return <Color type="background"/>
    }
    else if(name === "background-image" ){
      return <Images type="background"/>
    }
    else if(name === "ground-color" ){
      return <Color type="ground"/>
    }
    else if(name === "ground-image" ){
      return <Images type="ground" />
    }
     else if(name === "ground-vertices" ){
      return <Ground />
    } else {
      return <span></span>;
    }
  };
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [demoLoaded, setDemoLoaded] = useState(false);
  const [loadingGear, setLoadingGear] = useState(false);
  const [files, setFiles] = useState([])
  const [elements, setElements] = useState({
    mixers:[], camera:{}, controls:{}, scene:{}, renderer:{},pointer:{}, partials:{},loaders:{},onWindowResize:()=>{}
  })
  const toggleModal = ()=>setModalOpen(!modalOpen);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleLoaded = () => setDemoLoaded(!demoLoaded);
  const toggleLoadingGear = (b) => setLoadingGear(b);
  const  loadGLTFModel = (file,resolve) => {
    const {name,size,url} = file[0];
    const {scene,loaders} = elements;

    const loader = new loaders.GLTFLoader();
    var dracoLoader = new DRACOLoader();
    loader.setDRACOLoader( dracoLoader );
    if(url) {
      loader.load(url, gltf => {
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
        setModalOpen(false);       
        const newLayers = {...props.layers};
        newLayers.tree[0].children.push({ key: `0-${newLayers.tree[0].children.length}`, title: name, checkable:false,selectable:false})
        props.setLayers(newLayers);       
        resolve(true);

      });
    } else {
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
        setModalOpen(false);       
        const newLayers = {...props.layers};
        newLayers.tree[0].children.push({ key: `0-${newLayers.tree[0].children.length}`, title: name, checkable:false,selectable:false})
        props.setLayers(newLayers);       

      });  
    }
    
  }   
  const  loadFBXModel = (file,resolve) => {
    const {name,size,url} = file[0];
    const {scene,loaders} = elements;
    const loader = new loaders.FBXLoader();
    if (url) {
      loader.load(url, object => {
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
        setModalOpen(false);       
        const newLayers = {...props.layers};
        newLayers.tree[0].children.push({ key: `0-${newLayers.tree[0].children.length}`, title: name, checkable:false,selectable:false})
        props.setLayers(newLayers);       
        resolve(true);

      });
    } else {
      loader.load2(file, object => {
        // if(object.animations.length > 0) {
        //   elements.mixer = new THREE.AnimationMixer( object );
        //   var action = elements.mixer.clipAction( object.animations[ 0 ] );
        //   action.play();  
        // }
        
        // object.traverse( child => {
        //   if ( child.isMesh ) {
        //     child.castShadow = true;
        //     child.receiveShadow = true;
        //   }
        // } );
        props.loadModel({name,size,object});
        setModalOpen(false);       
        const newLayers = {...props.layers};
        newLayers.tree[0].children.push({ key: `0-${newLayers.tree[0].children.length}`, title: name, checkable:false,selectable:false})
        props.setLayers(newLayers);       

      });  
    }
  }
  useEffect(()=>{
      let {mixers,camera,controls,scene,renderer,pointer,partials,loaders} = elements;
      const rendererContainer = document.getElementById("three-map");
      const newWorld = createWorld(camera,controls,scene,renderer,pointer,partials,loaders,rendererContainer,mixers,props.setModelRuntimeInfo,props.showCoords);
      props.setScene(newWorld.scene);
      props.setPlane({id:Date.now(),mesh:newWorld.partials.plane,gridHelper:newWorld.partials.gridHelper});
      props.setSky({id:Date.now(),mesh:newWorld.partials.sky});
      setElements({...newWorld});
  },[]);

  const load = (f = []) => {
      const pa = [];
      const theFiles = f.length > 0 ? f : Array.prototype.slice.call(files); 
      if(theFiles.length == 0) {return  false;}

      if(f.length > 0) {
        theFiles.map(file=>{
          pa.push(new Promise( (resolve,reject) => {
            const extention = file.name.split(".")[file.name.split(".").length - 1].toLowerCase();
            const vectorExt = ["xlsx","xls","ods","csv","xyz"];

            if (vectorExt.indexOf(extention) > -1) {
              fetch(file.url)
                .then(res => res.text())
                .then( (result) => {
                  const rows = [result.split("\n").map(v=>v.split(",").map(a=>Number(a)))];
                  rows[0][rows[0].length - 1] = [];
                    const {name,size} = file;
                    const newLayers = {...props.layers};
                    newLayers.tree[1].children[2].children.push({ key: `1-2-${newLayers.tree[1].children[2].children.length}`, title: name,icon:<span></span>})
                    newLayers.checked.push(`1-2-${newLayers.tree[1].children[2].children.length}`);
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
                    resolve(true);
                  })
                .catch(e=> {
                  resolve(true)
                  console.log(e)
                })
            } else if(extention == "fbx") {
              loadFBXModel([file],resolve);
            } else if (extention === "glb" || extention === "gltf") {
              loadGLTFModel([file],resolve);
            }
          }))
        })
        return Promise.all(pa)

      } else {
        theFiles.map(file=>{
          const extention = file.name.split(".")[file.name.split(".").length - 1].toLowerCase();
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

              const {name,size} = file;
              const newLayers = {...props.layers};
              newLayers.tree[1].children[2].children.push({ key: `1-2-${newLayers.tree[1].children[2].children.length}`, title: name, checkable:true,selectable:false,icon:<span></span>})
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
            reader.readAsBinaryString(file);
            setModalOpen(false);       
            
           
          } else if(extention == "fbx") {
            loadFBXModel([file]);
          } else if (extention === "glb" || extention === "gltf") {
            loadGLTFModel([file]);
          }
        })
        setFiles([])
      }
  }
                
  return (
    <div className="App">
      <header className="App-header">
        <Navbar expand="md" className="navbar navbar-dark">
          <NavbarBrand href="#"><div className="logo-container"><div className="logo"/></div></NavbarBrand>
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
              <NavItem>
                <NavLink disabled = {demoLoaded} onClick={()=>{
                  if(!demoLoaded) {
                    toggleLoaded();
                    toggleLoadingGear(true);
                    props.loadDemo(props,load,toggleLoadingGear)
                    .then(e=>
                      toggleLoadingGear(false)
                    )
                    .catch(e=>
                      toggleLoadingGear(false)
                    )
                  }
                }}>Load Demo</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink>
                    <a href = "https://youtu.be/aaurmX8Mq5U" target="_blank">Youtube Video</a>
                  </NavLink>
              </NavItem>
            </Nav>
            <NavbarText>
                <NavLink href="https://github.com/prieston/mergin_mode" target="_blank">
                <i className="fab fa-github"></i>
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
          <div id = "three-map" >
            <div id="axes-helper"></div>
            <div id="info-helper">
              <div id="epsg">EPSG: 32634</div>
              <div id="coords"></div>
            </div>
          </div>
          {(props.section!== null && allClasses(props.section)) || <span></span>}
        </SplitPane>
      </SplitPane>
        

      </main>
      <div style={{visibility:loadingGear ? "visible" : "hidden"}} className="loading-demo">
      <div>
        <div><i class="fas fa-cog"></i></div>
          <div>Loading Demo...</div>
          <div>This might take a few minutes depending on your internet connection.</div>
          <div>Meanwhile you can view a youtube demo by clicking the link below</div>
          <div><a href = "https://youtu.be/aaurmX8Mq5U" target="_blank">Youtube Video</a></div>
        </div>

      </div>
      <Modal
        isOpen={modalOpen}
        onRequestClose={()=>setModalOpen(!modalOpen)}
      >
        <div className="container form">
          <div className="row">
            <div className="col-sm-12">
              <DropZone onChange={e => {
                setFiles([...e.target.files]);
              }} />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6">
              <button className="btn btn-primary form-control" onClick={load}>Load</button>
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
    modelLayer:state.api.modelLayer,
    coords:state.api.plane.coords,
    state:state.api
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadModel:model =>dispatch(loadModel(model)),
    loadVector:vector =>dispatch(loadVector(vector)),
    changeSection:section => dispatch(changeSection(section)),
    setScene:scene => dispatch(setScene(scene)),
    setPlane:plane => dispatch(setPlane(plane)),
    setSky:sky => dispatch(setSky(sky)),
    setLayers:layers => dispatch(setLayers(layers)),
    setKeys:keys => dispatch(setKeys(keys)),
    showCoords:(x,y,z) => dispatch(showCoords(x,y,z)),
    addModel: (options,props) => addModel(options,props),
    loadDemo: (props,load) => dispatch(loadDemo(props,load)),
    loadGround: (vecId,props) => dispatch(loadGround(vecId,props)),
    setModelLayer: (layer) => dispatch(setModelLayer(layer)),
    setModelRuntimeInfo:(modelId,info) => dispatch(setModelRuntimeInfo(modelId,info))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);