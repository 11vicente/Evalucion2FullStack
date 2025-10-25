import React from 'react';

export default function Footer() {
  return (
    <footer className="py-4 mt-5 text-center">
      <p className="mb-1">&copy; 2025 Pastelería Mil Sabores. Todos los derechos reservados.</p>
      <p className="mb-0">
        <a href="#" className="text-decoration-none text-light">Política de Privacidad</a> | 
        <a href="#" className="text-decoration-none text-light">Términos y Condiciones</a>
      </p>
    </footer>
  );
}