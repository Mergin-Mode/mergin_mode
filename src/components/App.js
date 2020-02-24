import React,{ useState,useEffect } from 'react';
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
import createWorld from "../helpers/createWorld";
import SplitPane from 'react-split-pane';
import Modal from "react-modal";

Modal.setAppElement('#root')

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [files, setFiles] = useState([])
  const [elements, setElements] = useState({
    camera:{}, controls:{}, scene:{}, renderer:{},pointer:{}, partials:{},loaders:{}
  })
  const toggleModal = ()=>setModalOpen(!modalOpen);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const  loadModel = file => {
    const {scene,loaders} = elements;
    const loader = new loaders.FBXLoader();
      loader.load2(file, object => {
        object.traverse( child => {
          if ( child.isMesh ) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        } );
        scene.add( object );
        setModalOpen(!modalOpen);       
      });
  }
  useEffect(()=>{
      let {camera,controls,scene,renderer,pointer,partials,loaders} = elements;
      const rendererContainer = document.getElementById("three-map");
      const newWorld = createWorld(camera,controls,scene,renderer,pointer,partials,loaders,rendererContainer);
      setElements({...newWorld});
  },[])
  return (
    <div className="App">
      <header className="App-header">
        <Navbar color="dark" light expand="md">
          <NavbarBrand href="/">3DRW</NavbarBrand>
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
                <NavLink href="https://github.com/reactstrap/reactstrap">GitHub</NavLink>
              </NavItem>
            </Nav>
            <NavbarText>3drw</NavbarText>
          </Collapse>
        </Navbar>
      </header>
      <main>
        <SplitPane split="horizontal" minSize={50} defaultSize={"80%"}>
          <div>
            <SplitPane split="vertical" minSize={50} defaultSize={"20%"}>
              <div />
              <div id = "three-map" />
            </SplitPane>
          </div>
          <div />
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

export default App;
