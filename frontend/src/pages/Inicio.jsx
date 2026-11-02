import GraficoTransaccionesTipo from "../components/GraficoTransaccionesTipo";

function Inicio(){
    return (
        <main className="page">
            <header className="page-header">
                <div>
                    <h1 className="page-title">Inicio</h1>
                    <p className="page-description">
                        Resumen general de All The Best.
                    </p>
                </div>
            </header>

            <GraficoTransaccionesTipo />
        </main>
    )
}

export default Inicio;