// spec/Boton.spec.js
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Boton from "../Boton";

describe("Pruebas de propiedades (props) en Boton", () => {
  it("debe recibir y mostrar correctamente la etiqueta", () => {
    render(<Boton label="Enviar" onClick={() => {}} />);
    expect(screen.getByText("Enviar")).toBeTruthy();
  });

  it("debe ejecutar la función onClick al hacer clic", () => {
    const handleClick = jasmine.createSpy("handleClick");
    render(<Boton label="Click" onClick={handleClick} />);
    fireEvent.click(screen.getByText("Click"));
    expect(handleClick).toHaveBeenCalled();
  });
});
