import IndexV2 from './pages/IndexV2'
import AdminPrecos from './pages/AdminPrecos'

function App() {
  if (window.location.pathname === '/admin-precos') return <AdminPrecos />
  return <IndexV2 />
}

export default App
