import "../styles/ConfirmModal.css";

function ConfirmModal({
    titulo,
    mensaje,
    textoBoton,
    onConfirmar,
    onCancelar
}) {

    return (

        <div className="modal-overlay">

            <div className="confirm-modal">

                <h2>{titulo}</h2>

                <p>{mensaje}</p>

                <div className="confirm-actions">

                    <button
                        className="btn-secondary"
                        onClick={onCancelar}
                    >
                        Cancelar
                    </button>

                    <button
                        className="btn-danger"
                        onClick={onConfirmar}
                    >
                        {textoBoton}
                    </button>

                </div>

            </div>

        </div>

    );
}
export default ConfirmModal;