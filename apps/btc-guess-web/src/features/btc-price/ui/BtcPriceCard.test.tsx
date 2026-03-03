import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@/test/test-utils";
import { BtcPriceCard } from "./BtcPriceCard";
import * as useBtcPriceModule from "../model/useBtcPrice";

vi.mock("../model/useBtcPrice");

describe("BtcPriceCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the card title", () => {
    vi.spyOn(useBtcPriceModule, "useBtcPrice").mockReturnValue({
      price: null,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<BtcPriceCard />);
    expect(screen.getByText("Live price")).toBeInTheDocument();
  });

  it("displays loading state", () => {
    vi.spyOn(useBtcPriceModule, "useBtcPrice").mockReturnValue({
      price: null,
      loading: true,
      error: null,
      refetch: vi.fn(),
    });

    render(<BtcPriceCard />);
    expect(screen.getByText("Updating…")).toBeInTheDocument();
  });

  it("displays error message when there is an error", () => {
    const errorMessage = "Failed to fetch price";
    vi.spyOn(useBtcPriceModule, "useBtcPrice").mockReturnValue({
      price: null,
      loading: false,
      error: errorMessage,
      refetch: vi.fn(),
    });

    render(<BtcPriceCard />);
    const errorElement = screen.getByRole("alert");
    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveTextContent(errorMessage);
  });

  it("displays formatted price when loaded successfully", () => {
    vi.spyOn(useBtcPriceModule, "useBtcPrice").mockReturnValue({
      price: { usd: 45123.56 },
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<BtcPriceCard />);
    expect(screen.getByText("$45,123.56")).toBeInTheDocument();
  });

  it("formats price with correct decimal places", () => {
    vi.spyOn(useBtcPriceModule, "useBtcPrice").mockReturnValue({
      price: { usd: 50000 },
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<BtcPriceCard />);
    expect(screen.getByText("$50,000.00")).toBeInTheDocument();
  });

  it("accepts custom refresh interval", () => {
    const mockUseBtcPrice = vi
      .spyOn(useBtcPriceModule, "useBtcPrice")
      .mockReturnValue({
        price: { usd: 45000 },
        loading: false,
        error: null,
        refetch: vi.fn(),
      });

    render(<BtcPriceCard refreshIntervalMs={5000} />);
    expect(mockUseBtcPrice).toHaveBeenCalledWith(5000);
  });

  it("uses default refresh interval when not specified", () => {
    const mockUseBtcPrice = vi
      .spyOn(useBtcPriceModule, "useBtcPrice")
      .mockReturnValue({
        price: { usd: 45000 },
        loading: false,
        error: null,
        refetch: vi.fn(),
      });

    render(<BtcPriceCard />);
    expect(mockUseBtcPrice).toHaveBeenCalledWith(10000);
  });
});
