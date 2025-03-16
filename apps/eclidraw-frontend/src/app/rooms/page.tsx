import { fetchAllRooms } from "@/actions";
import { AddRoomDialog, RoomCard } from "@/components/room";

export default async function RoomPage() {
  const data = await fetchAllRooms();

  return (
    <div>
      <div className="bg-gray-100 min-h-screen">
        <div className="container mx-auto py-12 px-6">
          <div className="flex justify-between items-center mb-5">
            <h1 className="text-xl font-bold">Rooms</h1>

            <div>
              <AddRoomDialog />
            </div>
          </div>

          <div className="grid grid-cols-3 items-center justify-center gap-5">
            {data.map((room) => {
              return <RoomCard key={room.id} {...room} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
