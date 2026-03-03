import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import { SignInForm } from './SignInForm';
import * as AuthContext from '../model/AuthContext';

vi.mock('../model/AuthContext');

describe('SignInForm', () => {
  const mockSignIn = vi.fn();
  const mockClearError = vi.fn();
  const mockOnSwitchToSignUp = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      signIn: mockSignIn,
      error: null,
      clearError: mockClearError,
      user: null,
      loading: false,
      signUp: vi.fn(),
      confirmSignUp: vi.fn(),
      signOut: vi.fn(),
      resendConfirmationCode: vi.fn(),
    });
  });

  it('renders email and password fields', () => {
    render(<SignInForm onSwitchToSignUp={mockOnSwitchToSignUp} />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('renders submit button', () => {
    render(<SignInForm onSwitchToSignUp={mockOnSwitchToSignUp} />);
    
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('renders switch to sign up button', () => {
    render(<SignInForm onSwitchToSignUp={mockOnSwitchToSignUp} />);
    
    expect(screen.getByText(/don't have an account\?/i)).toBeInTheDocument();
  });

  it('displays error message when error exists', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      signIn: mockSignIn,
      error: 'Invalid credentials',
      clearError: mockClearError,
      user: null,
      loading: false,
      signUp: vi.fn(),
      confirmSignUp: vi.fn(),
      signOut: vi.fn(),
      resendConfirmationCode: vi.fn(),
    });

    render(<SignInForm onSwitchToSignUp={mockOnSwitchToSignUp} />);
    
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });

  it('allows user to type in email field', async () => {
    const user = userEvent.setup();
    render(<SignInForm onSwitchToSignUp={mockOnSwitchToSignUp} />);
    
    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'test@example.com');
    
    expect(emailInput).toHaveValue('test@example.com');
  });

  it('allows user to type in password field', async () => {
    const user = userEvent.setup();
    render(<SignInForm onSwitchToSignUp={mockOnSwitchToSignUp} />);
    
    const passwordInput = screen.getByLabelText(/password/i);
    await user.type(passwordInput, 'password123');
    
    expect(passwordInput).toHaveValue('password123');
  });

  it('calls signIn with correct credentials on form submit', async () => {
    const user = userEvent.setup();
    mockSignIn.mockResolvedValueOnce(undefined);
    
    render(<SignInForm onSwitchToSignUp={mockOnSwitchToSignUp} />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    expect(mockSignIn).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('calls clearError before submitting', async () => {
    const user = userEvent.setup();
    mockSignIn.mockResolvedValueOnce(undefined);
    
    render(<SignInForm onSwitchToSignUp={mockOnSwitchToSignUp} />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    expect(mockClearError).toHaveBeenCalled();
  });

  it('disables submit button while loading', async () => {
    const user = userEvent.setup();
    let resolveSignIn: () => void;
    const signInPromise = new Promise<void>((resolve) => {
      resolveSignIn = resolve;
    });
    mockSignIn.mockReturnValue(signInPromise);
    
    render(<SignInForm onSwitchToSignUp={mockOnSwitchToSignUp} />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    expect(submitButton).toBeDisabled();
    expect(screen.getByText(/signing in/i)).toBeInTheDocument();
    
    resolveSignIn!();
  });

  it('calls onSwitchToSignUp when sign up link is clicked', async () => {
    const user = userEvent.setup();
    render(<SignInForm onSwitchToSignUp={mockOnSwitchToSignUp} />);
    
    const signUpButton = screen.getByRole('button', { name: /don't have an account/i });
    await user.click(signUpButton);
    
    expect(mockOnSwitchToSignUp).toHaveBeenCalled();
  });

  it('requires email field to be filled', () => {
    render(<SignInForm onSwitchToSignUp={mockOnSwitchToSignUp} />);
    
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    expect(emailInput.required).toBe(true);
  });

  it('requires password field to be filled', () => {
    render(<SignInForm onSwitchToSignUp={mockOnSwitchToSignUp} />);
    
    const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;
    expect(passwordInput.required).toBe(true);
  });

  it('has correct input types', () => {
    render(<SignInForm onSwitchToSignUp={mockOnSwitchToSignUp} />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
});
