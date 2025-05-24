import { Button, LinearProgress, Typography, Box } from "@mui/material";
import { useState, useRef } from "react";
import "../styles/Landing.css";
import axios from "axios";

export default function Landing() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [status, setStatus] = useState<string>("");
  const [generatedText, setGeneratedText] = useState<string>("");
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideo(e.target.files[0]);
      setGeneratedText("");
      setStatus("");
      setProgress(0);
      console.log("Selected video:", e.target.files[0].name); 
    }
  };

  const simulateProgress = async (formData: FormData) => {
    console.log("Starting upload to /upload"); 
    setStatus("Uploading...");
    setProgress(0);
    let percent = 0;

    
    const uploadInterval = setInterval(() => {
      percent += 2;
      setProgress(percent);

      if (percent >= 50) {
        clearInterval(uploadInterval);
        setStatus("Transcribing...");
      }
    }, 100);

   
    try {
      const uploadResponse = await axios.post(`${BACKEND_URL}/upload`, formData);
      console.log("Upload response:", uploadResponse.data); // Log upload response
      if (!uploadResponse.data.success) {
        clearInterval(uploadInterval);
        setStatus("Upload failed ❌");
        return;
      }
    } catch (error) {
      console.error("Upload error:", error); 
      clearInterval(uploadInterval);
      setStatus("Upload failed ❌");
      return;
    }

   
    percent = 50;
    const transcribeInterval = setInterval(() => {
      percent += 2;
      setProgress(percent);

      if (percent >= 80) {
        setStatus("Generating Questions...");
      }

      if (percent >= 100) {
        clearInterval(transcribeInterval);
        setStatus("Done ✅");
      }
    }, 100);

    
    try {
      const textResponse = await axios.post(`${BACKEND_URL}/text`, formData);
      console.log("Text response:", textResponse.data); 
      setGeneratedText(textResponse.data.text);
    } catch (error) {
      console.error("Text generation error:", error); 
      clearInterval(transcribeInterval);
      setStatus("Failed to generate text ❌");
      setGeneratedText("");
    }
  };

  const handleUpload = async () => {
    if (!video) {
      alert("Please upload a video file");
      setStatus("No video selected ❌");
      return;
    }

    const formData = new FormData();
    formData.append("video", video);
    console.log("Uploading video:", video.name);

    try {
      await simulateProgress(formData);
    } catch (error) {
      console.error("Processing error:", error); 
      alert("Error processing file");
      setStatus("Processing failed ❌");
    }
  };

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

        {generatedText && (
          <Box className="result-box mt-4" sx={{ textAlign: "left", whiteSpace: "pre-wrap" }}>
            <Typography variant="h6">Generated Content</Typography>
            <Typography variant="body1">{generatedText}</Typography>
          </Box>
        )}
      </div>
    </div>
  );
}