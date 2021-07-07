import React from 'react'
import {act, render, screen} from '@testing-library/react';
import App from './App';

test('renders receivers', async () => {
    const fakeReceivers = [
        {name: 'FFW Mellensee', ric: 1234567},
        {name: 'FFW Mellensee', ric: 1234567},
        {name: 'FFW Mellensee', ric: 1234567},
        {name: 'FFW Mellensee', ric: 1234567},
        {name: 'FFW Mellensee', ric: 1234567},
    ];

    jest.spyOn(global, "fetch").mockImplementation(() => Promise.resolve({json: () => Promise.resolve(fakeReceivers)}));

    await act(async () => {
        render(<App/>);
    })

    const linkElement = screen.getByText(/FFW Mellensee/i);
    expect(linkElement).toBeInTheDocument();
});
