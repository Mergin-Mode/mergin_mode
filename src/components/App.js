import React,{ useState,useEffect } from 'react';
import './App.css';
import { connect } from "react-redux";
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
import {loadModel,changeSection,setScene,setLayers} from "../actions";

import ModelList from "./ModelList";
Modal.setAppElement('#root')

function App(props) {
  const allClasses = (name) => {
    if(name === "models" ){
      return <ModelList />
    } else {
      return <span></span>;
    }
  };
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [files, setFiles] = useState([])
  const [elements, setElements] = useState({
    camera:{}, controls:{}, scene:{}, renderer:{},pointer:{}, partials:{},loaders:{}
  })
  const toggleModal = ()=>setModalOpen(!modalOpen);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const  loadModel = file => {
    const {name,size} = file[0];
    const {scene,loaders} = elements;
    const loader = new loaders.FBXLoader();
      loader.load2(file, object => {
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
      let {camera,controls,scene,renderer,pointer,partials,loaders} = elements;
      const rendererContainer = document.getElementById("three-map");
      const newWorld = createWorld(camera,controls,scene,renderer,pointer,partials,loaders,rendererContainer);
      props.setScene(newWorld.scene);
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
                  <DropdownItem>
                    Open
                  </DropdownItem>
                  <DropdownItem divider />
                </DropdownMenu>
              </UncontrolledDropdown>
              <NavItem>
                <NavLink href="https://github.com/prieston/mergin_mode">GitHub</NavLink>
              </NavItem>
            </Nav>
            <NavbarText>Mergin' Mode</NavbarText>
          </Collapse>
        </Navbar>
      </header>
      <main>
        <SplitPane split="horizontal" minSize={50} maxSize={-50} defaultSize={"80%"}>

          <div>
            <SplitPane split="vertical" minSize={50} maxSize={-50} defaultSize={"20%"}>
              <div>
          <LayerPanel />
                
              </div>
              <div id = "three-map" />
            </SplitPane>
          </div>
          <div>
            {props.section!== null && allClasses(props.section)}
          </div>
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
              <button className="btn btn-primary form-control" onClick={()=>loadModel(files)}>Load</button>
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
    layers:state.api.layers
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadModel:model =>dispatch(loadModel(model)),
    changeSection:section => dispatch(changeSection(section)),
    setScene:scene => dispatch(setScene(scene)),
    setLayers:layers => dispatch(setLayers(layers)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
