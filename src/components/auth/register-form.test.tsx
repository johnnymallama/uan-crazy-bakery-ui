import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RegisterForm } from './register-form';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';

// Mocks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}));
jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
  getAuth: jest.fn(),
}));
jest.mock('@/lib/firebase', () => ({
  auth: {},
}));

const mockUseRouter = useRouter as jest.Mock;
const mockUseToast = useToast as jest.Mock;
const mockCreateUserWithEmailAndPassword = createUserWithEmailAndPassword as jest.Mock;

const dictionary = {
  title: 'Crear una cuenta',
  description: 'Ingresa tus datos para registrarte.',
  name: {
    label: 'Nombre',
    placeholder: 'Ingresa tu nombre',
  },
  email: {
    label: 'Correo electrónico',
    placeholder: 'nombre@ejemplo.com',
  },
  password: {
    label: 'Contraseña',
    placeholder: 'Ingresa tu contraseña',
  },
  confirmPassword: {
    label: 'Confirmar Contraseña',
  },
  submit: 'Crear cuenta',
  hasAccount: '¿Ya tienes una cuenta?',
  login: 'Inicia sesión',
  validation: {
    name: 'El nombre debe tener al menos 2 caracteres.',
    email: 'Por favor, introduce un correo electrónico válido.',
    password: 'La contraseña debe tener al menos 8 caracteres.',
    passwordMatch: 'Las contraseñas no coinciden.',
  },
  toast: {
    title: '¡Cuenta creada!',
    description: 'Hemos creado tu cuenta exitosamente.',
    error: {
      title: 'Error al registrarse',
      description: 'El correo electrónico ya está en uso. Por favor, intenta con otro.',
    },
  },
};

describe('RegisterForm', () => {
  const mockPush = jest.fn();
  const mockToast = jest.fn();

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({ push: mockPush });
    mockUseToast.mockReturnValue({ toast: mockToast });
  });

  it('should render the form correctly', () => {
    render(<RegisterForm dictionary={dictionary} lang="es" />);

    // Check if title and description are rendered
    expect(screen.getByRole('heading', { name: dictionary.title })).toBeInTheDocument();
    expect(screen.getByText(dictionary.description)).toBeInTheDocument();

    // Check for form fields
    expect(screen.getByLabelText(dictionary.name.label)).toBeInTheDocument();
    expect(screen.getByLabelText(dictionary.email.label)).toBeInTheDocument();
    expect(screen.getByLabelText(dictionary.password.label)).toBeInTheDocument();
    expect(screen.getByLabelText(dictionary.confirmPassword.label)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: dictionary.submit })).toBeInTheDocument();

    // Check for sign in link
    expect(screen.getByText(dictionary.hasAccount)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: dictionary.login })).toBeInTheDocument();
  });

  it('should show validation error for short name', async () => {
    render(<RegisterForm dictionary={dictionary} lang="es" />);

    const nameInput = screen.getByLabelText(dictionary.name.label);
    const submitButton = screen.getByRole('button', { name: dictionary.submit });

    fireEvent.change(nameInput, { target: { value: 'a' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(dictionary.validation.name)).toBeInTheDocument();
    });
  });

  it('should show validation error for password mismatch', async () => {
    render(<RegisterForm dictionary={dictionary} lang="es" />);

    const passwordInput = screen.getByLabelText(dictionary.password.label);
    const confirmPasswordInput = screen.getByLabelText(dictionary.confirmPassword.label);
    const submitButton = screen.getByRole('button', { name: dictionary.submit });

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password456' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(dictionary.validation.passwordMatch)).toBeInTheDocument();
    });
  });

  it('should successfully create a user and redirect', async () => {
    render(<RegisterForm dictionary={dictionary} lang="es" />);

    const nameInput = screen.getByLabelText(dictionary.name.label);
    const emailInput = screen.getByLabelText(dictionary.email.label);
    const passwordInput = screen.getByLabelText(dictionary.password.label);
    const confirmPasswordInput = screen.getByLabelText(dictionary.confirmPassword.label);
    const submitButton = screen.getByRole('button', { name: dictionary.submit });

    mockCreateUserWithEmailAndPassword.mockResolvedValueOnce({} as any);

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreateUserWithEmailAndPassword).toHaveBeenCalledWith(expect.any(Object), 'test@example.com', 'password123');
      expect(mockPush).toHaveBeenCalledWith('/es');
    });
  });

  it('should show toast on registration error', async () => {
    render(<RegisterForm dictionary={dictionary} lang="es" />);

    const nameInput = screen.getByLabelText(dictionary.name.label);
    const emailInput = screen.getByLabelText(dictionary.email.label);
    const passwordInput = screen.getByLabelText(dictionary.password.label);
    const confirmPasswordInput = screen.getByLabelText(dictionary.confirmPassword.label);
    const submitButton = screen.getByRole('button', { name: dictionary.submit });

    const error = { code: 'auth/email-already-in-use', message: 'Email already in use' };
    mockCreateUserWithEmailAndPassword.mockRejectedValueOnce(error);

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: error.message,
        variant: "destructive",
      });
    });
  });
});