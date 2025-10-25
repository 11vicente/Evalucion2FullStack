// spec/Listado.spec.js
import React from "react";
import { render, screen } from "@testing-library/react";
import Listado from "../Listado";

describe("Pruebas de renderizado en Listado", () => {
  it("debe renderizar todos los elementos de la lista", () => {
    const datos = ["Elemento 1", "Elemento 2", "Elemento 3"];
    render(<Listado items={datos} />);

    const elementos = screen.getAllByRole("listitem");
    expect(elementos.length).toBe(datos.length);
  });

  it("debe mostrar mensaje si no hay elementos", () => {
    render(<Listado items={[]} />);
    expect(screen.getByText("No hay elementos")).toBeTruthy();
  });
});
