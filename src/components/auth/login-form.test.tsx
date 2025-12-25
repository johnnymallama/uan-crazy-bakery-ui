import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from './login-form';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';

// Mocks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}));
jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
  getAuth: jest.fn(),
}));
jest.mock('@/lib/firebase', () => ({
  auth: {},
}));

const mockUseRouter = useRouter as jest.Mock;
const mockUseToast = useToast as jest.Mock;
const mockSignInWithEmailAndPassword = signInWithEmailAndPassword as jest.Mock;

const dictionary = {
  title: 'Iniciar sesión',
  description: 'Ingresa tus credenciales para acceder a tu cuenta.',
  email: {
    label: 'Correo electrónico',
    placeholder: 'nombre@ejemplo.com',
  },
  password: {
    label: 'Contraseña',
    placeholder: 'Ingresa tu contraseña',
  },
  submit: 'Iniciar sesión',
  noAccount: '¿No tienes una cuenta?',
  signUp: 'Regístrate',
  validation: {
    email: 'Por favor, introduce un correo electrónico válido.',
    password: 'La contraseña debe tener al menos 8 caracteres.',
  },
  toast: {
    error: {
      title: 'Error al iniciar sesión',
      description: 'Las credenciales son incorrectas. Por favor, inténtalo de nuevo.',
    },
  },
};

describe('LoginForm', () => {
  const mockPush = jest.fn();
  const mockToast = jest.fn();

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({ push: mockPush });
    mockUseToast.mockReturnValue({ toast: mockToast });
  });

  it('should render the form correctly', () => {
    render(<LoginForm dictionary={dictionary} lang="es" />);

    // Check if title and description are rendered
    expect(screen.getByRole('heading', { name: dictionary.title })).toBeInTheDocument();
    expect(screen.getByText(dictionary.description)).toBeInTheDocument();

    // Check for form fields
    expect(screen.getByLabelText(dictionary.email.label)).toBeInTheDocument();
    expect(screen.getByLabelText(dictionary.password.label)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: dictionary.submit })).toBeInTheDocument();

    // Check for sign up link
    expect(screen.getByText(dictionary.noAccount)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: dictionary.signUp })).toBeInTheDocument();
  });

  it('should show validation error for invalid email', async () => {
    render(<LoginForm dictionary={dictionary} lang="es" />);

    const emailInput = screen.getByLabelText(dictionary.email.label);
    const submitButton = screen.getByRole('button', { name: dictionary.submit });

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(dictionary.validation.email)).toBeInTheDocument();
    });
  });

  it('should show validation error for short password', async () => {
    render(<LoginForm dictionary={dictionary} lang="es" />);

    const emailInput = screen.getByLabelText(dictionary.email.label);
    const passwordInput = screen.getByLabelText(dictionary.password.label);
    const submitButton = screen.getByRole('button', { name: dictionary.submit });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: '12345' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(dictionary.validation.password)).toBeInTheDocument();
    });
  });

  it('should successfully sign in and redirect', async () => {
    render(<LoginForm dictionary={dictionary} lang="es" />);

    const emailInput = screen.getByLabelText(dictionary.email.label);
    const passwordInput = screen.getByLabelText(dictionary.password.label);
    const submitButton = screen.getByRole('button', { name: dictionary.submit });

    mockSignInWithEmailAndPassword.mockResolvedValueOnce({} as any);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith(expect.any(Object), 'test@example.com', 'password123');
      expect(mockPush).toHaveBeenCalledWith('/es/account');
    });
  });

  it('should show toast on login error', async () => {
    render(<LoginForm dictionary={dictionary} lang="es" />);

    const emailInput = screen.getByLabelText(dictionary.email.label);
    const passwordInput = screen.getByLabelText(dictionary.password.label);
    const submitButton = screen.getByRole('button', { name: dictionary.submit });

    const error = { code: 'auth/invalid-credential', message: 'Invalid credential' };
    mockSignInWithEmailAndPassword.mockRejectedValueOnce(error);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: dictionary.toast.error.title,
        description: dictionary.toast.error.description,
        variant: "destructive",
      });
    });
  });
});