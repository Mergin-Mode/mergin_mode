import React, {useCallback,useState} from 'react'
import {useDropzone} from 'react-dropzone'
 
function MyDropzone(props) {
  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
  const onChange = (e) => {
    setFileName(e.target.files[0]?.name || "");
    props.onChange(e)
  }
  const [fileName,setFileName] = useState("");
  return (
    <div className="mm-dropzone" {...getRootProps()} >
      <input {...getInputProps()} onChange={onChange} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
      }
      <p><a href="#">{fileName}</a></p>
    </div>
  )
}
export default MyDropzone;