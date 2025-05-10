import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, waitFor, screen, fireEvent } from "@testing-library/react";
import AlertsPanel from "../../src/components/AlertsPanel";
import earthquakeService from "../../src/services/earthquake";

// mock service
vi.mock("../../src/services/earthquake", () => ({
  default: {
    getAlerts: vi.fn(),
  },
}));

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
        needsCommandCenter: 0,
      },
    ],
  },
};

describe("AlertsPanel component", () => {
  beforeEach(() => {
    earthquakeService.getAlerts.mockResolvedValue(mockData);
  });

  it("should render data from API", async () => {
    render(<AlertsPanel />);

    await waitFor(() => {
      expect(screen.getByText("Taipei")).toBeInTheDocument();
      expect(screen.getByText("L2")).toBeInTheDocument();
      expect(screen.getByText("Yes")).toBeInTheDocument();
    });
  });

  it("should allow editing 'Has Damage' and 'Needs Command Center'", async () => {
    render(<AlertsPanel />);

    const editButton = await screen.findByText("Edit");
    fireEvent.click(editButton);

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(screen.getByText("Submit")).toBeInTheDocument();
    });
  });
});
