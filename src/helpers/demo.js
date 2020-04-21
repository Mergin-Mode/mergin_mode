export default function(props,load){
const urls = [
	{name:"loutro-old.glb",size:"0",url:process.env.PUBLIC_URL + "/demo/loutro-old.glb"},
	{name:"tree-green.fbx",size:"0",url:process.env.PUBLIC_URL + "/demo/tree-green.fbx"},
	{name:"tree-red.fbx",size:"0",url:process.env.PUBLIC_URL + "/demo/tree-red.fbx"},
	{name:"loutro-new.gltf",size:"0",url:process.env.PUBLIC_URL + "/demo/loutro-new.gltf"},
	{name:"loutro-old.csv",size:"0",url:process.env.PUBLIC_URL + "/demo/loutro-old.csv"},
	{name:"loutro-new.csv",size:"0",url:process.env.PUBLIC_URL + "/demo/loutro-new.csv"},
	{name:"trees-green.csv",size:"0",url:process.env.PUBLIC_URL + "/demo/trees-green.csv"},
	{name:"trees-red.csv",size:"0",url:process.env.PUBLIC_URL + "/demo/trees-red.csv"},
	{name:"trees-red.csv",size:"0",url:process.env.PUBLIC_URL + "/demo/dtm.csv"},
]

load(urls);
}
