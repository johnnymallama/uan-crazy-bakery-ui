import { render, screen } from '@testing-library/react';
import { Footer } from '@/components/layout/footer';

describe('Footer', () => {
  it('renders footer links and copyright', () => {
    // ARRANGE
    render(<Footer lang="en" />);

    // ACT
    const contactLink = screen.getByRole('link', { name: /contact/i });
    const privacyLink = screen.getByRole('link', { name: /privacy policy/i });
    const termsLink = screen.getByRole('link', { name: /terms of service/i });
    const copyright = screen.getByText(/all rights reserved/i);

    // ASSERT
    expect(contactLink).toBeInTheDocument();
    expect(privacyLink).toBeInTheDocument();
    expect(termsLink).toBeInTheDocument();
    expect(copyright).toBeInTheDocument();
    // Check if the current year is in the document
    expect(screen.getByText(new RegExp(new Date().getFullYear().toString()))).toBeInTheDocument();
  });
});
