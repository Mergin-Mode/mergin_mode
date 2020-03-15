export const loadModel = model => ({
  type: 'LOAD_MODEL',
  model,
  id:Date.now()
})

export const changeSection = section => ({
  type: 'CHANGE_SECTION',
  section
})
