import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Button } from "./Button";

describe("Button Component", () => {
  it("debe renderizarse correctamente con el texto provisto", () => {
    render(<Button>AGENDAR CLASE</Button>);
    expect(screen.getByText("AGENDAR CLASE")).toBeDefined();
  });

  it("debe aplicar las clases del variante primario por defecto", () => {
    render(<Button>INGRESAR</Button>);
    const buttonElement = screen.getByText("INGRESAR");
    expect(buttonElement.className).toContain("bg-[#FF4D00]");
  });
});