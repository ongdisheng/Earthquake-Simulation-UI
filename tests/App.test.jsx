import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "../src/App";

describe("App component", () => {
  it("should render the title in h1", () => {
    render(<App />);
    const heading = screen.getByRole("heading", {
      name: "Earthquake Simulation",
    });
    expect(heading).toBeInTheDocument();
  });
});
