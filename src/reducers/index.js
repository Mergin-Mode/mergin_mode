import { combineReducers } from 'redux'
const initialState = {
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
	  	return Object.assign({},state,
	  		Object.assign({},state.models,{
	  			models: {
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
	  		}));
  	case "CHANGE_SECTION":
	  	return Object.assign({},state,
	  		Object.assign({},state.section,{
	  			section:{
	  				active:action.section,
	  				title:titles[action.section] || null
	  			},
	  		}));
	  	case "SET_SCENE":
	  	return Object.assign({},state,
	  		Object.assign({},state.scene,{
	  			scene:action.scene,
	  		}));
    default:
      return state
  }
}

export default combineReducers({
  api
})