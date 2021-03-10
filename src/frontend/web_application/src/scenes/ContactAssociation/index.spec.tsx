import * as React from 'react';
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { rest } from 'msw';
import { server } from 'test/server';
import { AllProviders } from 'test/providers';
import { generateContact } from 'test/fixtures/contacts';
import ContactAssociation from '.';

const contacts = [
  generateContact({
    contact_id: 'foo',
    title: 'Foo',
    family_name: 'Bar',
  }),
  generateContact({
    title: 'Me',
    family_name: 'Em',
    user_id: 'u-john-01',
  }),
];

jest.mock('src/modules/user/services/isAuthenticated', () => ({
  isAuthenticated: () => true,
}));

describe('ContactAssociation', () => {
  beforeEach(() => {
    server.use(
      rest.get('/api/v2/contacts', (req, res, ctx) => {
        return res(
          ctx.json({ contacts, total: contacts.length }),
          ctx.status(200)
        );
      })
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  // This test is unstable for some reasons :/
  it('render', async () => {
    render(<ContactAssociation />, { wrapper: AllProviders });

    await waitForElementToBeRemoved(
      screen.getByRole('list', { name: 'Contact list is loading.' })
    );

    const expectedName = `${contacts[0].given_name} ${contacts[0].family_name}`;

    // trigger another render because of multiple fetches?
    expect(await screen.findByText(expectedName)).toBeVisible();
  }, 100000); // TIMEOUT
});
