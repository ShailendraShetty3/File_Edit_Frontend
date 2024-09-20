import { BrowserRouter, Routes, Route } from "react-router-dom";
import FileUpload from './components/index'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FileUpload />} >

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
