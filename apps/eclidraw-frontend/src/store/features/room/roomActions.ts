import {createAsyncThunk} from "@reduxjs/toolkit";
import {KnownError, RoomFormFormikType} from "@/iterfaces";
import {clientPostRequest} from "@/utils";
import {AxiosError} from "axios";


export const addNewRoom = createAsyncThunk<void, RoomFormFormikType, { rejectValue: KnownError }>(
    "room/add-new-room",
    async (roomData, {rejectWithValue},) => {

        try {
            return await clientPostRequest({
                endpoint: '/rooms',
                data: roomData
            })

        } catch (err) {
            const error = err as AxiosError<KnownError>


            if(!error.response) {
                return rejectWithValue({
                    code: 0,
                    message: error.message,
                    description: error.message
                })
            }

            return rejectWithValue(error.response.data)
        }

    }
)