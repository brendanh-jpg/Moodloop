import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Composer from './pages/Composer'
import Detail from './pages/Detail'
import MusicMaker from './pages/MusicMaker'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/new" element={<Composer />} />
        <Route path="/edit/:id" element={<Composer />} />
        <Route path="/entry/:id" element={<Detail />} />
        <Route path="/maker" element={<MusicMaker />} />
      </Routes>
    </BrowserRouter>
  )
}
