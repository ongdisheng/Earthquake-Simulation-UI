import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import PageCard from "../../src/components/PageCard";

describe("PageCard component", () => {
  it("should render the given title", () => {
    render(<PageCard title="Test Title">Test Content</PageCard>);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("should render the children inside the card", () => {
    render(
      <PageCard title="Another Title">
        <div data-testid="custom-child">Custom Content</div>
      </PageCard>,
    );
    expect(screen.getByTestId("custom-child")).toHaveTextContent(
      "Custom Content",
    );
  });
});
