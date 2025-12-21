import { render, screen } from '@testing-library/react';
import Home from '@/app/[lang]/page';

// Mock the dictionary
jest.mock('@/lib/get-dictionary', () => ({
  getDictionary: async (lang: string) => ({
    home: {
      hero: {
        title: 'Welcome to Crazy Bakery',
        subtitle: 'Where every bite is a piece of heaven.',
        cta: 'Order Now',
      },
      creations: {
        title: 'Our Creations',
        subtitle: 'A glimpse into the magic we bake every day.',
      },
    },
  }),
}));

describe('Home page', () => {
  it('renders the main heading', async () => {
    // ARRANGE
    const jsx = await Home({ params: { lang: 'en' } });
    render(jsx);

    // ACT
    const heading = screen.getByRole('heading', {
      name: /welcome to crazy bakery/i,
      level: 1
    });

    // ASSERT
    expect(heading).toBeInTheDocument();
  });
});
