import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

globalThis.WebSocket = class {
  constructor(url) {
    this.url = url;
    this.readyState = 1; // OPEN
  }
  send() {}
  close() {
    this.readyState = 3; // CLOSED
  }
  addEventListener() {}
  removeEventListener() {}
};

// runs a clean after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});
