import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

// Lazy load components
const FileUpload = lazy(() => import('./components/index'));
const VideoUpload = lazy(() => import('./Video/index'));
const Home = lazy(() => import("./Home"));

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/file" element={<FileUpload />} />
          <Route path="/video" element={<VideoUpload />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
