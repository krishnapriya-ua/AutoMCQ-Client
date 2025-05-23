
import { Button } from "@mui/material"
import { useState } from "react"
import '../styles/Landing.css'
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
//import axios from 'axios'

export default function Landing() {
  const [video,setVideo] = useState<File | null>(null)

  const handleChange = (e :React.ChangeEvent<HTMLInputElement>)=>{
    if(e.target.files && e.target.files[0]){
      setVideo(e.target.files[0])
    }
  }

  const handleUpload = async()=>{
    if(!video){
      <Stack sx={{ width: '100%' }} spacing={2}>
      <Alert variant="outlined" severity="warning">Please upload a video first!!</Alert>
      </Stack>
      return
    }
    
      console.log('Uploading',video.name)
    
  }
  
  return (

    <div className="landing-container my-5">

      <div className="content-box text-center">

        <h6 className="title">AUTOMCQ</h6>
        <p className="subtitle">Upload your video to generate MCQs</p>

        <div className="upload-box mt-4">
          <input type="file" accept="video/mp4" className="form-control mb-3" onChange={handleChange} />
          <Button className="upload-button" variant="contained"
          onClick={handleUpload}>UPLOAD</Button>
          
        </div>

      </div>
    </div>
  )
}
