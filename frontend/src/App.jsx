import { BrowserRouter, Route, Routes } from 'react-router-dom'

import './css/allthebest.css'

import Clientes from './pages/Clientes'
import ClientesForm from './pages/ClientesForm'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/clientes/nuevo" element={<ClientesForm />} />
          <Route path="/clientes/:numrun/editar" element={<ClientesForm />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
