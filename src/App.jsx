import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar'
import Home from './Pages/Blog'
import Blog from './Pages/Contact'
import Projects from './Pages/Project'
import Contact from './Pages/Contact'

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col items-center">
        <Navbar />
        <div className="w-full max-w-5xl p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
