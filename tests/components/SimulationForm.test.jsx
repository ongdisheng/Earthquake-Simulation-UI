import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, vi } from "vitest";
import SimulationForm from "../../src/components/SimulationForm";

vi.mock("../../src/services/earthquake", () => ({
  default: {
    create: vi.fn(),
  },
}));

describe("SimulationForm component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    render(<SimulationForm />);
  });

  it("should render the form fields", () => {
    expect(screen.getByLabelText(/Epicenter Location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Magnitude Value/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Focal Depth/i)).toBeInTheDocument();
    expect(screen.getByText("Submit")).toBeInTheDocument();
    expect(screen.getByText("Reset")).toBeInTheDocument();
  });

  it("should reset all form fields when Reset button is clicked", async () => {
    const user = userEvent.setup();

    await user.type(
      screen.getByLabelText(/Epicenter Location/i),
      "Test Location",
    );
    await user.type(screen.getByLabelText(/Magnitude Value/i), "6.5");
    await user.type(screen.getByLabelText(/Focal Depth/i), "30");

    const resetButton = screen.getByRole("button", { name: /Reset/i });
    await user.click(resetButton);

    await waitFor(() => {
      expect(screen.getByLabelText(/Epicenter Location/i)).toHaveValue("");
      expect(screen.getByLabelText(/Magnitude Value/i)).toHaveValue("");
      expect(screen.getByLabelText(/Focal Depth/i)).toHaveValue("");
    });
  });

  it("should display errors when submitting empty form", async () => {
    const user = userEvent.setup();
    const submitButton = screen.getByRole("button", { name: /Submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      const errors = screen.getAllByText((content, element) => {
        return (
          element?.className?.includes("ant-form-item-explain-error") &&
          content.toLowerCase().includes("required")
        );
      });
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  it("should be able to add and remove shaking area fields", async () => {
    const user = userEvent.setup();

    const addButton = screen.getByRole("button", { name: /Add/i });
    await user.click(addButton);

    const selectPlaceholder = await screen.findByText("Select a county");
    expect(selectPlaceholder).toBeInTheDocument();

    const removeIcon = screen.getByTestId("remove-icon-0");
    await user.click(removeIcon);

    await waitFor(() => {
      expect(screen.queryByText("Select a county")).not.toBeInTheDocument();
    });
  });
});
