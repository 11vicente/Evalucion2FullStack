import React from 'react';

export default function Contact() {
  function handleSubmit(e) {
    e.preventDefault();
    alert('Mensaje enviado (simulado). Gracias.');
    e.target.reset();
  }

  return (
    <div>
      <section className="text-center py-5">
        <div className="container">
          <h1 className="section-title">Contáctanos</h1>
          <p className="lead">Envíanos tus dudas, sugerencias o comentarios 📨</p>
        </div>
      </section>

      <main className="container my-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <form className="p-4 rounded shadow-sm bg-white" onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Nombre completo</label>
                <input type="text" className="form-control" required />
              </div>
              <div className="mb-3">
                <label className="form-label">Correo electrónico</label>
                <input type="email" className="form-control" required />
              </div>
              <div className="mb-3">
                <label className="form-label">Mensaje</label>
                <textarea className="form-control" rows="5" required />
              </div>
              <button type="submit" className="btn btn-custom">Enviar</button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}