import React, {useEffect, useState} from 'react'
import CreateReceiver from './CreateReceiver'
import SendAlarm from './SendAlarm'

export default function Receivers(props) {
    const [receivers, setReceivers] = useState([])
    const [selected, setSelected] = useState([])

    async function fetchReceivers() {
        // setReceivers([
        //     {id: 1, name: 'FFW Mellensee', ric: 1234567},
        //     {id: 2, name: 'FFW Mellensee', ric: 21341234},
        //     {id: 3, name: 'FFW Mellensee', ric: 52342134},
        //     {id: 4, name: 'FFW Mellensee', ric: 12343425},
        //     {id: 5, name: 'FFW Mellensee', ric: 1234234},
        // ]);
        // return
        const response = await fetch("/receivers")
        setReceivers(await response.json())
    }

    const removeReceiver = (index, event) => {
        event.stopPropagation()

        if(window.confirm('Empfänger entfernen?')) {

            fetch('/receivers/' + receivers[index].id, {
                method: 'DELETE'
            })

            const receiversState = [...receivers]
            receiversState.splice(index, 1)
            setReceivers(receiversState)

        }
    }

    useEffect(() => {
        fetchReceivers()
    }, [])

    if (!receivers) {
        return 'Loading'
    }

    const listReceivers = receivers.map((el, index) =>
        <div className={`relative px-3 py-2 mb-5 rounded shadow ${selected.includes(el.ric) ? 'bg-blue-200' : 'bg-gray-100'}`}
             key={el.ric.toString() + "_" + index}
             onClick={() => selected.includes(el.ric) ? setSelected(selected.filter(s => s !== el.ric)) : setSelected([...selected, el.ric])}
        >
            <span className={"absolute top-0 right-0 w-4 h-4 flex items-center justify-center bg-red-200 rounded-full -mr-2 -mt-2 cursor-pointer z-10"}
                  onClick={(e) => removeReceiver(index, e)}>&times;</span>
            <div className={"text-sm"}>
                <p>Name: {el.name}</p>
                <p>RIC: {el.ric}</p>
            </div>
        </div>
    )

    return (
        <div className={"px-3 py-5"}>
            <div className={"flex items-center justify-between flex-wrap"}>
                {listReceivers}
            </div>
            <CreateReceiver addReceiver={(receiver) => setReceivers([...receivers, receiver])}/>
            <SendAlarm receivers={selected}/>
        </div>
    )
}
