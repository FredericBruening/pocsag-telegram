import React, {useEffect, useState} from 'react'

export default function CreateReceiver(props) {

    const handleSubmit = async (event) => {
        event.preventDefault()

        const elements = event.target.elements
        const receiver = {name: elements.name.value, ric: elements.ric.value}

        const rawResponse = await fetch('/receivers', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(receiver)
        });
        const content = await rawResponse.json();

        receiver.id =  content.id

        props.addReceiver(receiver)

        elements.name.value = ''
        elements.ric.value = ''

    };

    return (
        <form className={"rounded shadow p-3 mb-5 bg-gray-100"} onSubmit={handleSubmit}>
            <label className={"block mb-2 flex items-center justify-between"}>
                Name:
                <input className={"w-1/2"} type="text" name="name"/>
            </label>
            <label className={"block mb-2 flex items-center justify-between"}>
                RIC:
                <input className={"w-1/2"} type="number" name="ric"/>
            </label>

            <button className={"btn-sm bg-green-100"} type="submit">Erstellen</button>
        </form>
    )
}