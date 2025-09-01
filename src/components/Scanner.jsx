import React, {useRef, useState, useEffect} from 'react'
import { PDFDocument, rgb } from 'pdf-lib'

// Minimal scanner component: capture frame from camera, allow manual crop via canvas selection,
// then export as PDF using pdf-lib. For production replace crop UI with cropperjs/opencv.js and add OCR.

export default function Scanner(){
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [streamActive, setStreamActive] = useState(false)
  const [captured, setCaptured] = useState(null)
  const [pages, setPages] = useState([])

  useEffect(()=>{
    return ()=>{ // cleanup
      if(videoRef.current && videoRef.current.srcObject){
        videoRef.current.srcObject.getTracks().forEach(t=>t.stop())
      }
    }
  },[])

  async function startCamera(){
    try{
      const stream = await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'}, audio:false})
      videoRef.current.srcObject = stream
      await videoRef.current.play()
      setStreamActive(true)
    }catch(e){
      alert('Camera unavailable or permission denied. ' + (e.message || ''))
    }
  }

  function stopCamera(){
    if(videoRef.current && videoRef.current.srcObject){
      videoRef.current.srcObject.getTracks().forEach(t=>t.stop())
      setStreamActive(false)
    }
  }

  function captureFrame(){
    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    ctx.drawImage(video,0,0,canvas.width,canvas.height)
    const data = canvas.toDataURL('image/jpeg', 0.9)
    setCaptured(data)
  }

  function addPage(){
    if(!captured) return
    setPages(prev=>[...prev, captured])
    setCaptured(null)
  }

  async function exportPdf(){
    if(pages.length === 0 && !captured){ alert('No pages to export'); return }
    const doc = await PDFDocument.create()
    const list = pages.concat(captured? [captured]:[])
    for(const dataUrl of list){
      const imgBytes = await fetch(dataUrl).then(r=>r.arrayBuffer())
      const img = await doc.embedJpg(imgBytes)
      const page = doc.addPage([img.width, img.height])
      page.drawImage(img, {x:0,y:0,width:img.width,height:img.height})
    }
    const pdfBytes = await doc.save()
    const blob = new Blob([pdfBytes], {type:'application/pdf'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'quickscan_document.pdf'
    a.click()
    URL.revokeObjectURL(url)
  }

  function clearAll(){
    setPages([])
    setCaptured(null)
  }

  return (
    <div>
      <div style={{display:'flex',gap:12,alignItems:'flex-start',flexWrap:'wrap'}}>
        <div style={{flex:'1 1 360px'}}>
          <div style={{background:'#222',padding:8,borderRadius:8}}>
            <video ref={videoRef} style={{width:'100%', borderRadius:6}} playsInline muted />
            <canvas ref={canvasRef} style={{display:'none'}} />
          </div>
          <div className="controls" style={{marginTop:8}}>
            {!streamActive ? <button onClick={startCamera}>Start Camera</button> : <button onClick={stopCamera}>Stop Camera</button>}
            <button onClick={captureFrame}>Capture</button>
            <button onClick={addPage}>Add Page</button>
            <button onClick={exportPdf}>Export PDF</button>
            <button onClick={clearAll}>Clear</button>
          </div>
        </div>

        <div style={{width:260}}>
          <h3>Preview</h3>
          {captured ? <img src={captured} className="thumb" alt="captured" style={{width:'100%'}}/> : <div style={{height:120, background:'#eee', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center'}}>No capture</div>}
          <h4 style={{marginTop:8}}>Pages ({pages.length})</h4>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr', gap:8}}>
            {pages.map((p,i)=> <img key={i} src={p} className="thumb" alt={'page-'+i} />)}
          </div>
        </div>
      </div>
      <p style={{marginTop:12, color:'#444', fontSize:13}}>Notes: This prototype captures camera frames and exports a basic PDF. Replace with opencv.js for edge detection, cropperjs for cropping, and add OCR integrations for full product.</p>
    </div>
  )
}
