import { describe, it, expect, vi } from "vitest";
import axios from "axios";
import {
  getAlertSuppressTime,
  updateAlertSuppressTime,
} from "../../src/services/settings";

// mock axios
vi.mock("axios");

describe("settings service", () => {
  it("should call GET /api/settings/alert-suppress-time", async () => {
    const mockData = { data: { data: 120 } };
    axios.get.mockResolvedValueOnce(mockData);

    const result = await getAlertSuppressTime();

    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining("/api/settings/alert-suppress-time"),
    );
    expect(result).toEqual(mockData);
  });

  it("should call PUT /api/settings/alert-suppress-time with updated data", async () => {
    const payload = { alertSuppressTime: 300 };
    const mockResponse = { data: { data: 300 } };
    axios.put.mockResolvedValueOnce(mockResponse);

    const result = await updateAlertSuppressTime(payload);

    expect(axios.put).toHaveBeenCalledWith(
      expect.stringContaining("/api/settings/alert-suppress-time"),
      payload,
    );
    expect(result).toEqual(mockResponse);
  });
});
