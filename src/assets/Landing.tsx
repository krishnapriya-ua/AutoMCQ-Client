import { Button, LinearProgress, Typography } from "@mui/material"
import { useState, useRef } from "react"
import '../styles/Landing.css'
import axios from "axios";

export default function Landing() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [video, setVideo] = useState<File | null>(null)
  const [progress, setProgress] = useState<number>(0)
  const [status, setStatus] = useState<string>('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideo(e.target.files[0])
    }
  }

  const simulateProgress = () => {
  setStatus('Uploading...')
  setProgress(0)
  let percent = 0

  const interval = setInterval(() => {
    percent += 1
    setProgress(percent)

    if (percent === 100) {
      clearInterval(interval)
      setStatus('Uploaded') 

      setTimeout(() => {
        setStatus('Transcribing...')

        setTimeout(() => {
          setStatus('Generating Questions...')

          setTimeout(() => {
            setStatus('Done ✅')

            
            setVideo(null)
            if (fileInputRef.current) {
              fileInputRef.current.value = ''
            }
          }, 2000)

        }, 3000)

      }, 1000)
    }
  }, 100) 
}


  const handleUpload = async () => {
  if (!video) {
    alert('Please upload a video file')
    return
  }

  const formData = new FormData()
  formData.append('video', video)

  try {
    simulateProgress() // handles progress + status + input cleanup

    const response = await axios.post('http://localhost:8000/api/upload', formData)

    if (!response.data.success) {
      alert('Upload failed')
      setStatus('Upload failed ❌')
    }
  } catch (error) {
    alert('Error uploading file')
    setStatus('Upload failed ❌')
  }
}



  return (
    <div className="landing-container my-5">
      <div className="content-box text-center">
        <h6 className="title">AUTOMCQ</h6>
        <p className="subtitle">Upload your video to generate MCQs</p>

        <div className="upload-box mt-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4"
            className="form-control mb-3"
            onChange={handleChange}
          />
          <Button className="upload-button" variant="contained" onClick={handleUpload}>
            UPLOAD
          </Button>
        </div>

        {status && (
          <div className="status-box mt-4">
            <Typography variant="body1">{status}</Typography>
            <LinearProgress variant="determinate" value={progress} />
          </div>
        )}
      </div>
    </div>
  )
}
