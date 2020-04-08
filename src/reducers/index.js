import React, { Component }  from 'react';
import { combineReducers } from 'redux'
window.mergin_mode = {
	modelLayer: [],
	vectors:[],
	plane:{},
	sky:{},
	mixers:[]
}
const initialState = {
	layers:[
	  {
	    key: 'models',
	    title: 'Models',
	    checkable:false,
	    selectable:true,
	    icon:<span className="layer-icon"><i className="far fa-folder"></i></span>,
	    children: [
	    ],
	  },
	  {
	    key: 'scene',
	    title: 'Scene',
	    checkable:false,
	    selectable:false,
	    icon:<span className="layer-icon"><i className="far fa-folder"></i></span>,
	    children: [
	      {
	        key: 'background',
	        title: 'Background',
	        checkable:false,
	   	    icon:<span className="layer-icon"><i className="far fa-folder"></i></span>,
	        children: [
	        { key: 'background-color', title: 'Color',icon:<span className="layer-icon"><i className="fas fa-palette"></i></span>},
	        { key: 'background-image', title: 'Image',icon:<span className="layer-icon"><i className="far fa-file-image"></i></span> },
	        { key: 'background-video', title: 'Video',icon:<span className="layer-icon"><i className="far fa-file-video"></i></span> }
	      ] },
	      {
	        key: 'ground',
	        title: 'Ground',
	        checkable:false,
   		    icon:<span className="layer-icon"><i className="far fa-folder"></i></span>,
   		    // switcherIcon:<span className="layer-icon switch-icon"><i className="fas fa-chevron-right"></i></span>,

	        selectable:false,
	        children: [
	          { key: 'ground-color', title: 'Color',icon:<span className="layer-icon"><i className="fas fa-palette"></i></span>},
	          { key: 'ground-image', title: 'Image' ,icon:<span className="layer-icon"><i className="far fa-file-image"></i></span>},
	          { key: 'ground-vertices', title: 'Vertices' ,icon:<span className="layer-icon"><i className="fas fa-mountain"></i></span>}
	        ],
	      },
	      {
	        key: 'vector-layers',
	        title: 'Vector Layers',
	   	    icon:<span className="layer-icon"><i className="far fa-folder"></i></span>,
	        checkable:false,
	        selectable:false,
	        children: []
	      },
	      {
	        key: 'model-layers',
	        title: 'Model Layers',
	   	    icon:<span className="layer-icon"><i className="far fa-folder"></i></span>,
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
		dem:[],
		color:"#222"
	},
	sky:{
		id:null,
		mesh:{}
	},
	background:{
		color:"#000"
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
	case "SET_SKY":{
		  	const newState = Object.assign({},state,{
		  		sky:{...state.sky,...action.sky},
		  	});
		  	window.mergin_mode.sky = newState.sky;
		  	return newState;}
	case "SET_LAYERS":
		return Object.assign( {},state,{
			layers: action.layers
	  	});
	case "SET_BACKGROUND_COLOR":
		return Object.assign( {},state,{
			background: {color:action.color}
	  	});
	case "SET_GROUND_COLOR":
		return Object.assign( {},state,{
			plane: {...state.plane,color:action.color}
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