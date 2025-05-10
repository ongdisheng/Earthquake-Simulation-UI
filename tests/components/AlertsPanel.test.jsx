import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, waitFor, screen, fireEvent } from "@testing-library/react";
import AlertsPanel from "../../src/components/AlertsPanel";
import earthquakeService from "../../src/services/earthquake";
import { notify } from "../../src/utils/notificationHelper";

// mock service
vi.mock("../../src/services/earthquake", () => ({
  default: {
    getAlerts: vi.fn(),
    updateAlert: vi.fn(),
  },
}));
vi.mock("../../src/utils/notificationHelper", () => ({
  notify: vi.fn(),
}));

vi.mock("axios");

const mockData = {
  data: {
    data: [
      {
        id: "test-id-1",
        source: "Simulation",
        location: "Taipei",
        severityLevel: 2,
        originTime: "2025-05-09T15:46:13",
        hasDamage: 1,
        needsCommandCenter: "",
      },
    ],
  },
};

describe("AlertsPanel component", () => {
  beforeEach(() => {
    earthquakeService.updateAlert.mockResolvedValue({});
  });

  it("should render data from API", async () => {
    earthquakeService.getAlerts.mockResolvedValue(mockData);
    render(<AlertsPanel />);

    await waitFor(() => {
      expect(screen.getByText("Taipei")).toBeInTheDocument();
      expect(screen.getByText("L2")).toBeInTheDocument();
      expect(screen.getByText("Yes")).toBeInTheDocument();
    });
  });

  it("should able to edit, save and submit", async () => {
    earthquakeService.getAlerts.mockResolvedValue(mockData);
    render(<AlertsPanel />);

    const editButton = await screen.findByText("Edit");
    fireEvent.click(editButton);

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(screen.getByText("Submit")).toBeInTheDocument();
    });
  });

  it("should show error notification when hasDamage or needsCommandCenter is empty on submit", async () => {
    earthquakeService.getAlerts.mockResolvedValue(mockData);
    render(<AlertsPanel />);

    const submitButton = await screen.findByText("Submit");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(notify).toHaveBeenCalledWith(
        "error",
        "Please update both hasDamage and needsCommandCenter before submit",
      );
    });
  });

  it("should show success notification and update alert status to PROCESSED when submit is successful", async () => {
    const updatedAlert = {
      data: {
        data: [
          {
            id: "test-id-1",
            source: "Simulation",
            location: "Taipei",
            severityLevel: 2,
            originTime: "2025-05-09T15:46:13",
            hasDamage: 1,
            needsCommandCenter: 1,
          },
        ],
      },
    };

    earthquakeService.getAlerts.mockResolvedValue(updatedAlert);
    render(<AlertsPanel />);

    const submitButton = await screen.findByText("Submit");

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(notify).toHaveBeenCalledWith(
        "success",
        "You have responded to alert test-id-1",
      );
    });

    await waitFor(() => {
      expect(earthquakeService.updateAlert).toHaveBeenCalledWith(
        "test-id-1",
        expect.objectContaining({
          status: "PROCESSED",
          hasDamage: "1",
        }),
      );
    });
  });
});
