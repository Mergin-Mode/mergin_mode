import { combineReducers } from 'redux'
window.mergin_mode = {
	modelLayer: [],
	vectors:[],
	plane:{},
	mixers:[]
}
const initialState = {
	layers:[
	  {
	    key: '0',
	    title: 'Models',
	    checkable:false,
	    selectable:true,
	    children: [

	    ],
	  },
	  {
	    key: '1',
	    title: 'Scene',
	    checkable:false,
	    selectable:false,
	    children: [
	      {
	        key: '1-0',
	        title: 'Background',
	        checkable:false,
	        selectable:false,
	        children: [
	        { key: '1-0-0', title: 'Color'},
	        { key: '1-0-1', title: 'Image' },
	        { key: '1-0-2', title: 'Video' }
	      ] },
	      {
	        key: '1-1',
	        title: 'Ground',
	        checkable:false,
	        selectable:false,
	        children: [
	          { key: '1-1-0', title: 'Color'},
	          { key: '1-1-1', title: 'Image' },
	          { key: '1-1-2', title: 'Vertices' },
	        ],
	      },
	      {
	        key: '1-2',
	        title: 'Vector Layers',
	        checkable:false,
	        selectable:false,
	        children: []
	      },
	      {
	        key: '1-3',
	        title: 'Model Layers',
	        checkable:false,
	        selectable:false,
	        children: []
	      },
	    ],
	  },
	],
	scene:{	},
	plane:{
		id:null,
		mesh:{},
		dem:[]
	},
	models:{
		data:[]
	},
	vectors:{
		data:[]
	},
	modelLayer:[],
	section:{
		active:null,
		title:null
	}
};

const titles= {
	models:"Models"
};

const api = (state = initialState, action) => {
  switch (action.type) {
  	case "LOAD_MODEL":
	  	return Object.assign({},state, {
	  		models: Object.assign({},state.models,{
	  			data:[
	  				...state.models.data,
	  				{
	  					id:action.id,
	  					mesh:action.model.object,
	  					name:action.model.name,
	  					size:action.model.size
	  				}
	  			]
	  		}
	  	)});
	case "LOAD_VECTOR":{

		const newState = Object.assign({},state, {
	  		vectors: Object.assign({},state.vectors,{
	  			data:[
	  				...state.vectors.data,
	  				{
	  					id:action.id,
	  					array:action.vector.array,
	  					name:action.vector.name,
	  					size:action.vector.size
	  				}
	  			]
	  		}
	  	)});
	  	window.mergin_mode.vectors = newState.vectors;
	  	return newState; 
	}
  	case "CHANGE_SECTION":
	  	return Object.assign({},state,{
	  		section:Object.assign({},state.section,{
	  			active:action.section,
	  			title:titles[action.section] || null
	  		})
	  	});
	case "SET_SCENE":
	  	return Object.assign({},state,{
	  		scene:action.scene,
	  	});
	case "SET_PLANE":
	  	const newState = Object.assign({},state,{
	  		plane:{...state.plane,...action.plane},
	  	});
	  	window.mergin_mode.plane = newState.plane;
	  	return newState;
	case "SET_LAYERS":
		return Object.assign( {},state,{
			layers: action.layers
	  	});
	case "SET_MODEL_LAYER":{
		const newState = Object.assign( {},state,{
			modelLayer: [...state.modelLayer, action.layer]
	  	});
	  	window.mergin_mode.modelLayer = newState.modelLayer;
		return newState; 
	}
	case "SET_MODEL_RUNTIME_INFO":{
		const newState = Object.assign( {},state,{
			modelLayer: [...state.modelLayer.map(m=>{
				// console.log(m.id,action.modelId)
				if(m.id == action.modelId){
					m.runtimeInfo = action.runtimeInfo
				};
				return m;
			})]
	  	});
	  	window.mergin_mode.modelLayer = newState.modelLayer;
		return newState; 
	}
    default:
      return state
  }
}

export default combineReducers({
  api
})