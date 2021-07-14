import React, {useEffect, useState} from 'react'

export default function SendAlarm(props) {
    async function handleSubmit(event) {
        event.preventDefault()

        const elements = event.target.elements
        let ricArr = Array.from(elements)
            .filter(el => el.type === 'text' && el.value !== '')
            .map(el => parseInt(el.value))

        ricArr = ricArr.concat(props.receivers)

        const data = { message: elements.message.value, receivers: ricArr }

        fetch('/send-telegram', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
    }

    return (
        <div className={"rounded shadow p-3 bg-green-100"}>
            <h3 className={"font-bold mb-3"}>Alarmierung</h3>

            <form onSubmit={handleSubmit}>
                <label className={"text-sm"}>
                    Telegram-Text:
                    <textarea name="message" className={"w-full mb-2"} rows="5" required></textarea>
                </label>

                <label className={"text-sm"}>
                    RIC Manuell eingeben
                    <div>
                        <input className={"block mb-1"} type="text" name="ric[]"/>
                        <input className={"block mb-1"} type="text" name="ric[]"/>
                        <input className={"block mb-1"} type="text" name="ric[]"/>
                    </div>
                </label>

                <button className={"btn-sm mt-2 bg-white"} type="submit">Senden</button>
            </form>
        </div>
    )
}