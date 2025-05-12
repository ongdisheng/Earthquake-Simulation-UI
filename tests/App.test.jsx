import { render, screen, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import App from "../src/App";
import React from "react";
import { act } from "react-dom/test-utils";

// mock the handleAutoClose function
const handleAutoClose = vi.fn();

vi.mock("../src/components/AlertsPanel", async () => {
  const React = await import("react");
  return {
    __esModule: true,
    default: React.forwardRef((_, ref) => {
      const [alerts, setAlerts] = React.useState([
        { id: "alert-1", message: "Test Alert" },
      ]);

      React.useImperativeHandle(ref, () => ({
        handleAutoClose: (id) => {
          setAlerts((prev) => prev.filter((a) => a.id !== id));
        },
      }));

      return (
        <div>
          {alerts.map((alert) => (
            <div key={alert.id} data-testid={`alert-${alert.id}`}>
              {alert.message}
            </div>
          ))}
        </div>
      );
    }),
  };
});

describe("App component", () => {
  let mockWebSocketInstance;

  beforeEach(() => {
    handleAutoClose.mockReset();

    mockWebSocketInstance = {
      readyState: 1,
      close: vi.fn(),
      send: vi.fn(),
    };

    // Ensure WebSocket is replaced before App is rendered
    globalThis.WebSocket = vi.fn(() => mockWebSocketInstance);
  });

  it("should render the title in h1", () => {
    render(<App />);
    const heading = screen.getByRole("heading", {
      name: "Earthquake Simulator",
    });
    expect(heading).toBeInTheDocument();
  });

  it("calls handleAutoClose when AUTOCLOSED alert is received", async () => {
    render(<App />);

    // trigger WebSocket AUTOCLOSED message
    const alert = { id: "alert-1" };
    const message = JSON.stringify({
      type: "AUTOCLOSED",
      alert: JSON.stringify(alert),
    });

    await act(() => {
      mockWebSocketInstance.onmessage?.({ data: message });
    });

    // wait for the alert to be removed from the DOM
    await waitFor(() => {
      expect(screen.queryByTestId("alert-alert-1")).toBeNull();
    });
  });

  it("handles ADD type gracefully", async () => {
    render(<App />);
    const data = {
      type: "ADD",
      alert: { id: "alert-3" },
    };

    await act(() => {
      mockWebSocketInstance.onmessage?.({ data: JSON.stringify(data) });
    });
  });

  it("handles unknown type", async () => {
    console.warn = vi.fn(); // mock warn
    render(<App />);
    const data = {
      type: "RANDOM_TYPE",
      alert: { id: "alert-4" },
    };

    await act(() => {
      mockWebSocketInstance.onmessage?.({ data: JSON.stringify(data) });
    });

    expect(console.warn).toHaveBeenCalledWith("Unhandled type:", "RANDOM_TYPE");
  });

  it("handles malformed JSON", async () => {
    console.error = vi.fn(); // mock error
    render(<App />);

    await act(() => {
      mockWebSocketInstance.onmessage?.({ data: "NOT_JSON" });
    });

    expect(console.error).toHaveBeenCalledWith(
      "WebSocket message error",
      expect.any(SyntaxError),
    );
  });
});
