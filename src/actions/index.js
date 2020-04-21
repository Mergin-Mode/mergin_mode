import * as THREE from 'three';

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
  console.log(visible)
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

    }
    // data.plane.visible = visible;
    
  }  else if(layer === "models"){
    
  } else if(layer === "vectors"){
    
  }
}

export const showCoords = (x,y,z) => {
  return (dispatch,getState) => {
    const coords = getState().api.plane.coords;
    const diffX = coords.max.x - coords.min.x;
    const diffY = coords.max.y - coords.min.y;
    document.getElementById("coords").innerHTML = `${(x*diffX + coords.min.x).toFixed(2)}, ${(y*diffY + coords.min.y).toFixed(2)},${(coords.min.z + z).toFixed(2)}`;
  
  }
}