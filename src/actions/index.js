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
