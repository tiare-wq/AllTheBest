import { BrowserRouter, Route, Routes } from 'react-router-dom';

import BalanceAnual from './pages/BalanceAnual';
import Clientes from './pages/Clientes';
import Footer from './components/Footer';
import Header from './components/Header';
import PuntosVigentes from './pages/PuntosVigentes';
import Tarjeta from './pages/Tarjeta';
import TarjetaDetalle from './pages/TarjetaDetalle';
import TarjetaForm from './pages/TarjetaForm';
import TransaccionesCliente from './pages/TransaccionesCliente';
import TransaccionForm from "./pages/TransaccionForm";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/balance" element={<BalanceAnual />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path='/puntos' element={<PuntosVigentes />} />
          <Route path='/puntos' element={<Tarjeta />} />
          <Route path="/tarjetas" element={<Tarjeta />} />
          <Route path="/tarjetas/detalles/:nroTarjeta" element={<TarjetaDetalle />} />
          <Route path="/tarjetas/nuevo" element={<TarjetaForm />} />
          <Route path='/transacciones' element={<TransaccionesCliente />} />
          <Route path='/transacciones/nuevo' element={<TransaccionForm />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
