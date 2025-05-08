import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, vi, expect, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import NavBar from "../../src/components/NavBar";

// mock useNavigate from react-router-dom
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockNavigate = vi.fn();

describe("NavBar component", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>,
    );
  });

  it("should render all menu items", () => {
    expect(screen.getByRole("menuitem", { name: /home/i })).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: /alerts/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: /settings/i }),
    ).toBeInTheDocument();
  });

  it("should navigate when menu item is clicked", async () => {
    const user = userEvent.setup();
    const settingsItem = screen.getByRole("menuitem", { name: /settings/i });

    await user.click(settingsItem);

    expect(mockNavigate).toHaveBeenCalledWith("/settings");
  });
});
