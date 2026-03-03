import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@/test/test-utils";
import userEvent from "@testing-library/user-event";
import { GuessGameCard } from "./GuessGameCard";
import * as useGuessGameModule from "../model/useGuessGame";

vi.mock("../model/useGuessGame");

describe("GuessGameCard", () => {
  const mockHandleGuess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the card title and description", () => {
    vi.spyOn(useGuessGameModule, "useGuessGame").mockReturnValue({
      status: "idle",
      direction: null,
      timeLeftSeconds: 0,
      countdownProgress: 0,
      error: null,
      handleGuess: mockHandleGuess,
    });

    render(<GuessGameCard playerId="player123" />);
    expect(screen.getByText("Place your guess")).toBeInTheDocument();
    expect(
      screen.getByText("Will BTC be higher or lower in 60 seconds?"),
    ).toBeInTheDocument();
  });

  it("displays loading state", () => {
    vi.spyOn(useGuessGameModule, "useGuessGame").mockReturnValue({
      status: "loading",
      direction: null,
      timeLeftSeconds: 0,
      countdownProgress: 0,
      error: null,
      handleGuess: mockHandleGuess,
    });

    const { container } = render(<GuessGameCard playerId="player123" />);
    const loader = container.querySelector(".animate-spin");
    expect(loader).toBeInTheDocument();
  });

  it("displays error message when there is an error", () => {
    const errorMessage = "Failed to submit guess";
    vi.spyOn(useGuessGameModule, "useGuessGame").mockReturnValue({
      status: "idle",
      direction: null,
      timeLeftSeconds: 0,
      countdownProgress: 0,
      error: errorMessage,
      handleGuess: mockHandleGuess,
    });

    render(<GuessGameCard playerId="player123" />);
    const errorElement = screen.getByRole("alert");
    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveTextContent(errorMessage);
  });

  it("renders Up and Down buttons in idle state", () => {
    vi.spyOn(useGuessGameModule, "useGuessGame").mockReturnValue({
      status: "idle",
      direction: null,
      timeLeftSeconds: 0,
      countdownProgress: 0,
      error: null,
      handleGuess: mockHandleGuess,
    });

    render(<GuessGameCard playerId="player123" />);
    expect(screen.getByRole("button", { name: /up/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /down/i })).toBeInTheDocument();
  });

  it("disables buttons when playerId is not provided", () => {
    vi.spyOn(useGuessGameModule, "useGuessGame").mockReturnValue({
      status: "idle",
      direction: null,
      timeLeftSeconds: 0,
      countdownProgress: 0,
      error: null,
      handleGuess: mockHandleGuess,
    });

    render(<GuessGameCard playerId="" />);
    const upButton = screen.getByRole("button", { name: /up/i });
    const downButton = screen.getByRole("button", { name: /down/i });

    expect(upButton).toBeDisabled();
    expect(downButton).toBeDisabled();
  });

  it('calls handleGuess with "up" when Up button is clicked', async () => {
    const user = userEvent.setup();
    vi.spyOn(useGuessGameModule, "useGuessGame").mockReturnValue({
      status: "idle",
      direction: null,
      timeLeftSeconds: 0,
      countdownProgress: 0,
      error: null,
      handleGuess: mockHandleGuess,
    });

    render(<GuessGameCard playerId="player123" />);
    const upButton = screen.getByRole("button", { name: /up/i });
    await user.click(upButton);

    expect(mockHandleGuess).toHaveBeenCalledWith("up");
  });

  it('calls handleGuess with "down" when Down button is clicked', async () => {
    const user = userEvent.setup();
    vi.spyOn(useGuessGameModule, "useGuessGame").mockReturnValue({
      status: "idle",
      direction: null,
      timeLeftSeconds: 0,
      countdownProgress: 0,
      error: null,
      handleGuess: mockHandleGuess,
    });

    render(<GuessGameCard playerId="player123" />);
    const downButton = screen.getByRole("button", { name: /down/i });
    await user.click(downButton);

    expect(mockHandleGuess).toHaveBeenCalledWith("down");
  });

  it("displays countdown state with direction", () => {
    vi.spyOn(useGuessGameModule, "useGuessGame").mockReturnValue({
      status: "counting",
      direction: "up",
      timeLeftSeconds: 45,
      countdownProgress: 0.75,
      error: null,
      handleGuess: mockHandleGuess,
    });

    render(<GuessGameCard playerId="player123" />);
    expect(screen.getByText(/You guessed/i)).toBeInTheDocument();
    expect(screen.getByText("up")).toBeInTheDocument();
    expect(screen.getByText("45")).toBeInTheDocument();
    expect(screen.getByText("Result in 45s")).toBeInTheDocument();
  });

  it("displays countdown state for down direction", () => {
    vi.spyOn(useGuessGameModule, "useGuessGame").mockReturnValue({
      status: "counting",
      direction: "down",
      timeLeftSeconds: 30,
      countdownProgress: 0.5,
      error: null,
      handleGuess: mockHandleGuess,
    });

    render(<GuessGameCard playerId="player123" />);
    expect(screen.getByText("down")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
  });

  it("displays submitting state", () => {
    vi.spyOn(useGuessGameModule, "useGuessGame").mockReturnValue({
      status: "submitting",
      direction: null,
      timeLeftSeconds: 0,
      countdownProgress: 0,
      error: null,
      handleGuess: mockHandleGuess,
    });

    const { container } = render(<GuessGameCard playerId="player123" />);
    const loader = container.querySelector(".animate-spin");
    expect(loader).toBeInTheDocument();
  });

  it("accepts optional playerData prop", () => {
    const mockUseGuessGame = vi
      .spyOn(useGuessGameModule, "useGuessGame")
      .mockReturnValue({
        status: "idle",
        direction: null,
        timeLeftSeconds: 0,
        countdownProgress: 0,
        error: null,
        handleGuess: mockHandleGuess,
      });

    const playerData = {
      playerId: "player123",
      correctGuesses: 5,
      incorrectGuesses: 2,
      totalGuesses: 7,
      score: 5,
    };

    render(<GuessGameCard playerId="player123" playerData={playerData} />);

    expect(mockUseGuessGame).toHaveBeenCalledWith("player123", {
      initialPlayerData: playerData,
    });
  });
});
