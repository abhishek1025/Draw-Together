import {fetchRooms} from "@/actions";



export default async function RoomPage(){

    const data =  await fetchRooms()

    return <div>
        <h1>Rooms</h1>
    </div>
}