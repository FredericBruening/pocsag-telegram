import React from 'react'
import {act, render, screen} from '@testing-library/react';
import Receivers from "./components/Receivers";

beforeEach(async () => {
    const fakeReceivers = [
        {name: 'FFW Mellensee 1', ric: 1234567},
        {name: 'FFW Mellensee', ric: 1234567},
        {name: 'FFW Mellensee', ric: 1234567},
        {name: 'FFW Mellensee', ric: 1234567},
        {name: 'FFW Mellensee', ric: 1234567},
    ];

    jest.spyOn(global, "fetch").mockImplementation(() => Promise.resolve({json: () => Promise.resolve(fakeReceivers)}));

    await act(async () => {
        render(<Receivers/>);
    })
})

test('renders receivers', () => {
    const elements = screen.getAllByText(/FFW Mellensee/i);

    expect(elements.length).toBe(5);
});

test('it renders create receiver', () => {
    const showFormButton = screen.getByText(/Neu/i);

    expect(showFormButton).toBeInTheDocument()

    showFormButton.click()

    const nameInput = screen.getByLabelText(/Name/i)
    const ricInput = screen.getByLabelText(/RIC/i)

    expect(nameInput).toBeInTheDocument()
    expect(ricInput).toBeInTheDocument()
})