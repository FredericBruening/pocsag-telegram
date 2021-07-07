import React, {useEffect, useState} from 'react'

export default function Receivers(props) {
    const [receivers, setReceivers] = useState(null)
    const [selected, setSelected] = useState([])

    async function fetchReceivers() {
        setReceivers([
            {name: 'FFW Mellensee', ric: 1234567},
            {name: 'FFW Mellensee', ric: 21341234},
            {name: 'FFW Mellensee', ric: 52342134},
            {name: 'FFW Mellensee', ric: 12343425},
            {name: 'FFW Mellensee', ric: 1234234},
        ]);
        return
        const response = await fetch("/receivers")
        setReceivers(await response.json())
    }

    useEffect(() => {
        fetchReceivers()
    }, [])

    if (!receivers) {
        return 'Loading'
    }

    const listReceivers = receivers.map(el =>
        <div className={`w-full px-3 py-2 mb-5 rounded ${selected.includes(el.ric) ? 'bg-green-200' : 'bg-gray-100'}` }
             onClick={() => selected.includes(el.ric) ? setSelected(selected.filter(s => s !== el.ric)) : setSelected([...selected, el.ric])}
        >
            <p>
                Name: {el.name}
            </p>
            <p>
                RIC: {el.ric}
            </p>
        </div>
    )

    return (
        <div className="flex flex-wrap p-5">
            {listReceivers}
        </div>
    )
}
