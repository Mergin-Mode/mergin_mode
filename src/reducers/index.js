import { combineReducers } from 'redux'
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
	        children: [],
	      },
	    ],
	  },
	],
	scene:{	},
	models:{
		data:[]
	},
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
	  					id:[action.id],
	  					mesh:action.model.object,
	  					name:action.model.name,
	  					size:action.model.size
	  				}
	  			]
	  		}
	  	)});
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
	case "SET_LAYERS":
		return Object.assign( {},state,{
			layers: action.layers
	  	});
    default:
      return state
  }
}

export default combineReducers({
  api
})