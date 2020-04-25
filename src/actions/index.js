import * as THREE from 'three';
import { SkeletonUtils } from 'three/examples/jsm/utils/SkeletonUtils.js';
import InstancedGroupMesh from "three-instanced-group-mesh";

export const loadModel = model => ({
  type: 'LOAD_MODEL',
  model,
  id:Date.now()
});

export const loadVector = vector => ({
  type: 'LOAD_VECTOR',
  vector,
  id:Date.now()
})

export const setScene = scene => ({
  type: 'SET_SCENE',
  scene,
  id:Date.now()
})

export const setKeys = keys => ({
  type: 'SET_KEYS',
  keys,
})

export const setPlane = plane => ({
  type: 'SET_PLANE',
  plane,
  id:Date.now()
})
export const setSky = sky => ({
  type: 'SET_SKY',
  sky,
  id:Date.now()
})
export const setBackgroundColor = color => ({
  type: 'SET_BACKGROUND_COLOR',
  color
});
export const setGroundColor = color => ({
  type: 'SET_GROUND_COLOR',
  color
});

export const changeSection = section => ({
  type: 'CHANGE_SECTION',
  section
})

export const setLayers = layers => ({
  type: 'SET_LAYERS',
  layers
})

export const setModelLayer = layer => ({
  type: 'SET_MODEL_LAYER',
  layer
})

export const setModelRuntimeInfo = (modelId,info) => ({
  type: 'SET_MODEL_RUNTIME_INFO',
    modelId,
  runtimeInfo:{
    ...info
  }
})

export const toggleLayer = (data,visible) => {
  // console.log(visible)
  const layer = data.name.split("-")[0]
  const sublayer = data.name.split("-")[1]
  if(layer === "background"){
   if (sublayer === "color") {
    data.scene.background = visible ? new THREE.Color(  data.backgroundColor ) : null;
   }
   else if (sublayer === "image") {
    data.sky.visible = visible;
   }
   else if (sublayer === "video") {}
  } else if(layer === "ground"){
    if(sublayer == "grid") {
      data.gridHelper.visible = visible;

    } else if(sublayer == "color") {
      console.log(data)
      data.plane.visible = visible;

    }
    // data.plane.visible = visible;
    
  }  else if(layer === "models"){
    const object = data.scene.getObjectById( Number(sublayer), true );
    object.visible = visible;    
  } else if(layer === "vectors"){
    
  }
}

export const showCoords = (x,y,z) => {
  return (dispatch,getState) => {
    const coords = getState().api.plane.coords;
    // console.log(coords)
    const diffX = coords.max.x - coords.min.x;
    const diffY = coords.max.y - coords.min.y;
    console.log(diffX, diffY)
    document.getElementById("coords").innerHTML = `${(x*diffX + coords.min.x).toFixed(2)}, ${(y*diffY + coords.min.y).toFixed(2)},${(coords.min.z + z).toFixed(2)}`;
    // window.data.push(`${(x*100 - 50).toFixed(2)},${(y*100 - 50).toFixed(2)},${(0 + z).toFixed(2)}`);
  
  }
}

export const addModel = (options, props)=> {
  const {d, scale,rotation,vector} = options;
    const theVector = props.vectors.filter(v=>{
      return v.id == vector[d.id]
    }
    )[0];
    if(!theVector) {
      return false;
    }

    const group = new THREE.Group();
    if (theVector.name.toLowerCase().includes("anime")){
      let mesh;
      if(d.name.toLowerCase().includes("glb") || d.name.toLowerCase().includes("gltf")){
        mesh = SkeletonUtils.clone( d.mesh.scene );
        var mixer = startAnimation( mesh, d.mesh.animations, "Walk" );
        window.mergin_mode.mixers.push(mixer)
      } else {
        mesh = d.mesh.clone();
        var mixer = startAnimation( mesh.children[0], d.mesh.animations, "Walk" );
        window.mergin_mode.mixers.push(mixer)

      }
      const rot = JSON.parse(rotation[d.id]);
      rot.x = Number(rot.x);
      rot.y = Number(rot.y);
      rot.z = Number(rot.z);
      const sca = JSON.parse(scale[d.id]);
      sca.x = Number(sca.x);
      sca.y = Number(sca.y);
      sca.z = Number(sca.z);
      // mesh.rotation.set(rot.x,rot.y,rot.z);
      const axisX = new THREE.Vector3(1, 0, 0);
      const axisY = new THREE.Vector3(0, 1, 0);
      const axisZ = new THREE.Vector3(0, 0, 1);
      mesh.rotateOnWorldAxis(axisX, rot.x);
      mesh.rotateOnWorldAxis(axisY, rot.y);
      // mesh.rotateOnWorldAxis(axisZ, rot.z);
      mesh.rotateOnWorldAxis(axisZ, (-theVector.array[0][0][3] )/63.6619772367581);
      // mesh.rotation.z = ((theVector.array[0][0][3])/63.6619772367581);

      mesh.scale.set(sca.x,sca.y,sca.z);
      mesh.position.set(...theVector.array[0][0]);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
      props.setModelLayer({
        id:Date.now(),
        vectorId:theVector.id,
        runtimeInfo:{animating:true,activeRow:0},
        mesh:group
      });
  } else {

     let mesh;
      if(d.name.toLowerCase().includes("glb") || d.name.toLowerCase().includes("gltf")){
      mesh = SkeletonUtils.clone( d.mesh.scene );

      } else {
        mesh = d.mesh.clone();
      }

      if(theVector.array[0].length > 2) {
        
              let new_mesh = new InstancedGroupMesh( mesh, theVector.array[0].length);
              // console.log(theVector.array[0].length)
              for ( var i = 0; i < theVector.array[0].length - 1; i ++ ) {
                var transform = new THREE.Object3D();
                transform.frustumCulled = false;
                const rot = JSON.parse(rotation[d.id]);
                rot.x = Number(rot.x);
                rot.y = Number(rot.y);
                rot.z = Number(rot.z);
                const axisX = new THREE.Vector3(1, 0, 0);
                const axisY = new THREE.Vector3(0, 1, 0);
                const axisZ = new THREE.Vector3(0, 0, 1);
                transform.rotateOnWorldAxis(axisX, rot.x);
                transform.rotateOnWorldAxis(axisY, rot.y);
                transform.rotateOnWorldAxis(axisZ, Math.random()*2*Math.PI);

                const randomXY = Math.random() * 0.1;
                const randomZ = Math.random() * 0.1 + 0.05;
                const sca = JSON.parse(scale[d.id]);
                sca.x = Number(sca.x) + randomXY;
                sca.y = Number(sca.y) + randomXY;
                sca.z = Number(sca.z) + randomZ;
                transform.scale.set(sca.x,sca.y,sca.z);
                transform.position.set( ...theVector.array[0][i] );
                transform.updateMatrix();

                new_mesh.setMatrixAt( i, transform.matrix );

            }

            group.add( new_mesh )
      } else {

        theVector.array[0].map(r=>{
         if(r.length == 0) {return false;}
         if(theVector.name.includes("new")) {
            mesh.traverse(function (node){
            if (node.isMesh) {
              node.material.transparent = true;
              node.material.opacity = 1;
              node.material.needsUpdate = true;
            }})
         } else {
           // var modifier = new SimplifyModifier();
            mesh.traverse(function (node){
            if (node.isMesh) {
              node.material.transparent = true;
              node.material.opacity = 1;
              node.material.needsUpdate = true;
            }})
         }
          
          // const pos = JSON.parse(position[d.id]);
          // pos.x = Number(pos.x);
          // pos.y = Number(pos.y);
          // pos.z = Number(pos.z);
          const rot = JSON.parse(rotation[d.id]);
          rot.x = Number(rot.x);
          rot.y = Number(rot.y);
          rot.z = Number(rot.z);
          const axisX = new THREE.Vector3(1, 0, 0);
          const axisY = new THREE.Vector3(0, 1, 0);
          const axisZ = new THREE.Vector3(0, 0, 1);
          mesh.rotateOnWorldAxis(axisX, rot.x);
          mesh.rotateOnWorldAxis(axisY, rot.y);
          mesh.rotateOnWorldAxis(axisZ, rot.z);
          // mesh.rotateOnWorldAxis(axisZ, ( )/63.6619772367581);

          const sca = JSON.parse(scale[d.id]);
          sca.x = Number(sca.x);
          sca.y = Number(sca.y);
          sca.z = Number(sca.z);
          mesh.rotation.set(rot.x,rot.y,rot.z);

          mesh.scale.set(sca.x,sca.y,sca.z);
        
          mesh.position.set(...r);
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          // if(theVector.name.includes("loutro")){
          //   mesh.traverse(function (node){
          //   if (node.isMesh) {
          //     if(node.material.map && node.geometry.boundingBox){
          //       node.material.map.wrapS = THREE.RepeatWrapping;
          //       node.material.map.wrapT = THREE.RepeatWrapping;
          //       const p1 = node.geometry.boundingBox.min;
          //       const p2 = node.geometry.boundingBox.max;
          //       const d = parseInt(Math.sqrt(Math.pow(p1.x - p2.x,2) + Math.pow(p1.y - p2.y,2) + Math.pow(p1.z - p2.z,2)));
          //       node.material.map.repeat.set( d,d );
          //     }
          //   }})
          // }
          window.meshes = window.meshes || []
          window.meshes.push (mesh);
          group.add(mesh)
        });
      }
  }
  const newLayers = {...props.layers};
  newLayers.checked.push(`models-${group.id}`)
  newLayers.tree[1].children[3].children.push({ key: `models-${group.id}`, title: d.name + "_" + theVector.name})
  props.scene.add(group);
  props.setLayers(newLayers);

  function startAnimation( skinnedMesh, animations, animationName ) {

        var mixer = new THREE.AnimationMixer( skinnedMesh );
        var clip = THREE.AnimationClip.findByName( animations, animationName );

        if ( clip ) {

          var action = mixer.clipAction( clip );
          action.play();

        }

        return mixer;

      }
}

export const loadDemo =  function(props,load){
  return (dispatch, getState) => {
    const urls = [
      {name:"loutro-old.glb",size:"0",url:process.env.PUBLIC_URL + "/demo/loutro-old.glb"},
      {name:"tree-green.fbx",size:"0",url:process.env.PUBLIC_URL + "/demo/tree-green.fbx"},
      {name:"tree-red.fbx",size:"0",url:process.env.PUBLIC_URL + "/demo/tree-red.fbx"},
      {name:"loutro-new.gltf",size:"0",url:process.env.PUBLIC_URL + "/demo/loutro-new.gltf"},
      {name:"man-walking.gltf",size:"0",url:process.env.PUBLIC_URL + "/demo/man-walking.gltf"},
      {name:"loutro-old.csv",size:"0",url:process.env.PUBLIC_URL + "/demo/loutro-old.csv"},
      {name:"loutro-new.csv",size:"0",url:process.env.PUBLIC_URL + "/demo/loutro-new.csv"},
      {name:"trees-green.csv",size:"0",url:process.env.PUBLIC_URL + "/demo/trees-green.csv"},
      {name:"trees-red.csv",size:"0",url:process.env.PUBLIC_URL + "/demo/trees-red.csv"},
      {name:"dtm.csv",size:"0",url:process.env.PUBLIC_URL + "/demo/dtm.csv"},
      {name:"anime-path-1.csv",size:"0",url:process.env.PUBLIC_URL + "/demo/anime-path-1.csv"},
      {name:"anime-path-2.csv",size:"0",url:process.env.PUBLIC_URL + "/demo/anime-path-2.csv"},
      {name:"anime-path-3.csv",size:"0",url:process.env.PUBLIC_URL + "/demo/anime-path-3.csv"},
      {name:"anime-path-4.csv",size:"0",url:process.env.PUBLIC_URL + "/demo/anime-path-4.csv"},
    ]

    load(urls).then(()=>{
      //all loaded
      const newState = getState();
      let d, vector, rotation, scale;

      //load trees green
      d = newState.api.models.data.filter(m=>m.name === "tree-green.fbx")[0];
      vector = {[d.id]:newState.api.vectors.data.filter(m=>m.name === "trees-green.csv")[0].id};
      rotation = {[d.id]:JSON.stringify({x:1.57,y:0,z:0})}
      scale = {[d.id]:JSON.stringify({x:0.1,y:0.1,z:0.1})}
      
      props.addModel({d, scale,rotation,vector},{
        ...props,
        section:newState.api.section.active,
        title:newState.api.section.title,
        layers:newState.api.layers,
        vectors: newState.api.vectors.data,
        modelLayer:newState.api.modelLayer,
        coords:newState.api.plane.coords,
        state:newState.api,
        scene:newState.api.scene
      })

      //load trees red
      d = newState.api.models.data.filter(m=>m.name === "tree-red.fbx")[0];
      vector = {[d.id]:newState.api.vectors.data.filter(m=>m.name === "trees-red.csv")[0].id};
      rotation = {[d.id]:JSON.stringify({x:1.57,y:0,z:0})}
      scale = {[d.id]:JSON.stringify({x:0.1,y:0.1,z:0.1})}
      
      props.addModel({d, scale,rotation,vector},{
        ...props,
        section:newState.api.section.active,
        title:newState.api.section.title,
        layers:newState.api.layers,
        vectors: newState.api.vectors.data,
        modelLayer:newState.api.modelLayer,
        coords:newState.api.plane.coords,
        state:newState.api,
        scene:newState.api.scene
      })

      //add sky
      var loader = new THREE.TextureLoader();
      loader.crossOrigin = "";
      loader.load("../assets/fantasy.jpg",
            function( texture ) {
              newState.api.sky.mesh.material = new THREE.MeshBasicMaterial( { map: texture, side: THREE.BackSide } );
              newState.api.sky.mesh.material.needsUpdate = true;
              // props.scene.add(props.sky)  
            },
            function () {},  // onProgress function
            function ( error ) { console.log( error ) } // onError function
        );
      // add ground
      props.loadGround(newState.api.vectors.data.filter(m=>m.name === "dtm.csv")[0].id,props)
      
      //load loutro old
      d = newState.api.models.data.filter(m=>m.name === "loutro-old.glb")[0];
      vector = {[d.id]:newState.api.vectors.data.filter(m=>m.name === "loutro-old.csv")[0].id};
      rotation = {[d.id]:JSON.stringify({x:1.57,y:0,z:0})}
      scale = {[d.id]:JSON.stringify({x:1.1,y:1.1,z:1.1})}
      
      props.addModel({d, scale,rotation,vector},{
        ...props,
        section:newState.api.section.active,
        title:newState.api.section.title,
        layers:newState.api.layers,
        vectors: newState.api.vectors.data,
        modelLayer:newState.api.modelLayer,
        coords:newState.api.plane.coords,
        state:newState.api,
        scene:newState.api.scene
      })

      //load loutro new
      d = newState.api.models.data.filter(m=>m.name === "loutro-new.gltf")[0];
      vector = {[d.id]:newState.api.vectors.data.filter(m=>m.name === "loutro-new.csv")[0].id};
      rotation = {[d.id]:JSON.stringify({x:1.57,y:0,z:0})}
      scale = {[d.id]:JSON.stringify({x:11,y:11,z:11})}
      
      props.addModel({d, scale,rotation,vector},{
        ...props,
        section:newState.api.section.active,
        title:newState.api.section.title,
        layers:newState.api.layers,
        vectors: newState.api.vectors.data,
        modelLayer:newState.api.modelLayer,
        coords:newState.api.plane.coords,
        state:newState.api,
        scene:newState.api.scene
      })

      //load man walking
      d = newState.api.models.data.filter(m=>m.name === "man-walking.gltf")[0];
      vector = {[d.id]:newState.api.vectors.data.filter(m=>m.name === "anime-path-1.csv")[0].id};
      rotation = {[d.id]:JSON.stringify({x:1.57,y:0,z:0})}
      scale = {[d.id]:JSON.stringify({x:1,y:1,z:1})}
      
      props.addModel({d, scale,rotation,vector},{
        ...props,
        section:newState.api.section.active,
        title:newState.api.section.title,
        layers:newState.api.layers,
        vectors: newState.api.vectors.data,
        modelLayer:newState.api.modelLayer,
        coords:newState.api.plane.coords,
        state:newState.api,
        scene:newState.api.scene
      })

      //load man walking
      d = newState.api.models.data.filter(m=>m.name === "man-walking.gltf")[0];
      vector = {[d.id]:newState.api.vectors.data.filter(m=>m.name === "anime-path-2.csv")[0].id};
      rotation = {[d.id]:JSON.stringify({x:1.57,y:0,z:0})}
      scale = {[d.id]:JSON.stringify({x:1,y:1,z:1})}
      
      props.addModel({d, scale,rotation,vector},{
        ...props,
        section:newState.api.section.active,
        title:newState.api.section.title,
        layers:newState.api.layers,
        vectors: newState.api.vectors.data,
        modelLayer:newState.api.modelLayer,
        coords:newState.api.plane.coords,
        state:newState.api,
        scene:newState.api.scene
      });

      //load man walking
      d = newState.api.models.data.filter(m=>m.name === "man-walking.gltf")[0];
      vector = {[d.id]:newState.api.vectors.data.filter(m=>m.name === "anime-path-3.csv")[0].id};
      rotation = {[d.id]:JSON.stringify({x:1.57,y:0,z:0})}
      scale = {[d.id]:JSON.stringify({x:1,y:1,z:1})}
      
      props.addModel({d, scale,rotation,vector},{
        ...props,
        section:newState.api.section.active,
        title:newState.api.section.title,
        layers:newState.api.layers,
        vectors: newState.api.vectors.data,
        modelLayer:newState.api.modelLayer,
        coords:newState.api.plane.coords,
        state:newState.api,
        scene:newState.api.scene
      });

      //load man walking
      d = newState.api.models.data.filter(m=>m.name === "man-walking.gltf")[0];
      vector = {[d.id]:newState.api.vectors.data.filter(m=>m.name === "anime-path-4.csv")[0].id};
      rotation = {[d.id]:JSON.stringify({x:1.57,y:0,z:0})}
      scale = {[d.id]:JSON.stringify({x:1,y:1,z:1})}
      
      props.addModel({d, scale,rotation,vector},{
        ...props,
        section:newState.api.section.active,
        title:newState.api.section.title,
        layers:newState.api.layers,
        vectors: newState.api.vectors.data,
        modelLayer:newState.api.modelLayer,
        coords:newState.api.plane.coords,
        state:newState.api,
        scene:newState.api.scene
      })
    });
  }
}
export const loadGround = (vecId)=>{
  return (dispatch,getState)=> {
    const state = getState();
    const props = {
      vectors:state.api.vectors.data,
      plane:state.api.plane.mesh,
    }

    let v = props.vectors.filter(vec => vec.id == vecId)[0]
        if(!v) {return false;}
        v = v.array[0];
        var positions = props.plane.geometry.attributes.position.array;
        var x, y, z, index;
        x = y = z = index = 0;
        let l = v.length - 2;
        let min = {x:Number(v[0][0]),y:Number(v[0][1]),z:Number(v[0][2])};
        let max = {x:Number(v[l][0]),y:Number(v[l][1]),z:Number(v[l][2])};

        for ( var i = 0; i <= l; i ++ ) {
            index ++; 
            index ++;
            positions[ index ++ ] = (((v[i] ||[])[2]) || 0) - 50;
            if (min.z>Number(v[i][2])){
              min.z = Number(v[i][2]);
            }
            if(max.z < Number(v[i][2])){
              max.z = Number(v[i][2])
            }
        }
        props.plane.geometry.attributes.position.needsUpdate = true;
        var loader = new THREE.TextureLoader();
          loader.crossOrigin = "";
          loader.load('../assets/cropped.png',
              function( texture ) {
                const material = new THREE.MeshBasicMaterial({map: texture});
                props.plane.material = material;
                props.plane.material.needsUpdate = true;
              },
              function () {},  // onProgress function
              function ( error ) { console.log( error ) } // onError function
          );
        
        var material = new THREE.MeshPhongMaterial( {
            color: "#000",
            polygonOffset: true,
            polygonOffsetFactor: 1, // positive value pushes polygon further away
            polygonOffsetUnits: 1
        } );
        props.plane.material = material;
        props.plane.material.needsUpdate = true;

        // var geo = new THREE.EdgesGeometry( props.plane.geometry ); // or WireframeGeometry
        // var mat = new THREE.LineBasicMaterial( { color: 0x999999, linewidth: 2 } );
        // var wireframe = new THREE.LineSegments( geo, mat );
        // props.plane.add( wireframe );
        const array = v;
        const coords = {min,max};
        dispatch(setPlane({dem:array,coords}));
  }

        

      }
