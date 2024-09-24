import { BrowserRouter, Routes, Route } from "react-router-dom";
import FileUpload from './components/index'

import VideoUpload from './Video/index'

import Home from "./Home"


function App() {
  return (
    <BrowserRouter>
      <Routes>

      <Route path="/" element={<Home />} >

      </Route>
        <Route path="/file" element={<FileUpload />} >

        </Route>

        <Route path="/video" element={<VideoUpload />} >

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
