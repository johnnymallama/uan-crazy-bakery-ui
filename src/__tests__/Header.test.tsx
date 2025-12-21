import { render, screen } from '@testing-library/react';
import { Header } from '@/components/layout/header';

// Mock the dictionary
jest.mock('@/lib/get-dictionary', () => ({
  getDictionary: async (lang: string) => ({
    navigation: {
      home: 'Home',
      order: 'Order',
      contact: 'Contact',
      login: 'Login',
      signUp: 'Sign Up',
    },
  }),
}));

describe('Header', () => {
  it('renders navigation links', async () => {
    // ARRANGE
    const jsx = await Header({ params: { lang: 'en' } });
    render(jsx);

    // ACT
    const homeLink = screen.getByRole('link', { name: 'Home' });
    const orderLink = screen.getByRole('link', { name: 'Order' });
    const contactLink = screen.getByRole('link', { name: 'Contact' });
    const loginLink = screen.getByRole('link', { name: 'Login' });
    const signUpLink = screen.getByRole('link', { name: 'Sign Up' });

    // ASSERT
    expect(homeLink).toBeInTheDocument();
    expect(orderLink).toBeInTheDocument();
    expect(contactLink).toBeInTheDocument();
    expect(loginLink).toBeInTheDocument();
    expect(signUpLink).toBeInTheDocument();
  });
});
