import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SettingsForm from "../../src/components/SettingsForm";
import * as settingsService from "../../src/services/settings";

// mock service
vi.mock("../../src/services/settings", () => ({
  getAlertSuppressTime: vi.fn(),
  updateAlertSuppressTime: vi.fn(),
}));

describe("SettingsForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should display current alert suppress time", async () => {
    settingsService.getAlertSuppressTime.mockResolvedValueOnce({
      data: { data: 120 },
    });

    render(<SettingsForm />);

    await waitFor(() => {
      expect(
        screen.getByText(/Current Alert Suppress Time:/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/120 sec/)).toBeInTheDocument();
    });
  });

  it("should display updated time after submit", async () => {
    const user = userEvent.setup();
    settingsService.getAlertSuppressTime.mockResolvedValueOnce({
      data: { data: 120 },
    });
    settingsService.updateAlertSuppressTime.mockResolvedValueOnce({
      data: { data: 200 },
    });

    render(<SettingsForm />);

    await waitFor(() => {
      expect(screen.getByText(/120 sec/)).toBeInTheDocument();
    });

    const input = screen.getByLabelText(/New Alert Suppress Time/i);
    await user.clear(input);
    await user.type(input, "200");

    await user.click(screen.getByRole("button", { name: /update/i }));

    await waitFor(() => {
      expect(screen.getByText(/200 sec/)).toBeInTheDocument();
      expect(settingsService.updateAlertSuppressTime).toHaveBeenCalledWith({
        alertSuppressTime: "200",
      });
    });
  });

  it("should show error if input is empty", async () => {
    const user = userEvent.setup();
    settingsService.getAlertSuppressTime.mockResolvedValueOnce({
      data: { data: 100 },
    });

    render(<SettingsForm />);
    await waitFor(() => {
      expect(screen.getByText(/100 sec/)).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /update/i }));

    await waitFor(() => {
      expect(screen.getByText(/required/i)).toBeInTheDocument();
    });
  });
});
