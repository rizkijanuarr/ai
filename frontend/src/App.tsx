import { Routes, Route } from 'react-router-dom'
import { Toaster } from "@/components/ui/sonner"
import Home from './pages/Home'
import DatasetModel from './pages/DatasetModel'
import Proses1 from './pages/Proses1'
import Proses2 from './pages/Proses2'
import Proses3 from './pages/Proses3'
import Proses4 from './pages/Proses4'
import Proses5 from './pages/Proses5'

function App() {
  return (
    <div className="dark">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dataset-model" element={<DatasetModel />} />
        <Route path="/proses-1" element={<Proses1 />} />
        <Route path="/proses-2" element={<Proses2 />} />
        <Route path="/proses-3" element={<Proses3 />} />
        <Route path="/proses-4" element={<Proses4 />} />
        <Route path="/proses-5" element={<Proses5 />} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
