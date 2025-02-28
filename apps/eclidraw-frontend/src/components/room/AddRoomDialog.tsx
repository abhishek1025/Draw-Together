"use client"

import {Button, Input, Modal} from "antd";
import {useState} from "react";
import {useFormik} from "formik";
import {CreateRoomSchema} from "@repo/common/types";
import TextArea from "antd/es/input/TextArea";
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import {addNewRoom} from "@/store/features/room/roomActions";
import {toast} from "@/utils";
import {useRouter} from "next/navigation";
import {RoomFormFormikType} from "@/iterfaces";

export default function AddRoomDialog() {

    const [open, setOpen] = useState<boolean>(false);
    const {roomFormLoading, roomFormError} = useAppSelector(state => state.room);
    const dispatch = useAppDispatch();
    const router = useRouter();

    const showModal = () => {
        setOpen(true);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const formik = useFormik<RoomFormFormikType>({
        initialValues: {
            slug: '',
            description: '',
        },
        validationSchema: CreateRoomSchema,
        onSubmit: async (values: RoomFormFormikType) => {

            const result = await dispatch(addNewRoom(values))

            if(addNewRoom.fulfilled.match(result)) {
                toast.success('New room added successfully!')
            }

            if (addNewRoom.rejected.match(result)) {
                toast.error(roomFormError ?? "Failed to create new room. Please try again later.")
            }

            setOpen(false);
            router.push('/rooms')
        }
    })

    return (
        <>
            <Button type="primary" onClick={showModal}>
                Add Room
            </Button>
            <Modal
                title="Add New Room"
                open={open}
                footer={
                   <div className="flex justify-end gap-x-4 items-center">
                       <Button type="default" onClick={handleCancel}>
                           Cancel
                       </Button>

                       <Button type="primary" htmlType="submit" form="add-new-form" loading={roomFormLoading} >
                           Add
                       </Button>
                   </div>
                }
                centered
            >
                <form className="space-y-4" id="add-new-form" onSubmit={formik.handleSubmit}>
                    <div className="grid w-full items-center gap-1.5">
                        <label htmlFor="slug">Title</label>
                        <Input type="text" id="slug" placeholder="Title" {...formik.getFieldProps("slug")}/>

                        {formik.errors.slug && formik.touched.slug && (
                            <div
                                className="text-sm text-red-600">
                                {formik.errors.slug}
                            </div>
                        )}
                    </div>

                    <div className="grid w-full items-center gap-1.5">
                        <label htmlFor="description">Description</label>
                        <TextArea id="description" placeholder="Description" {...formik.getFieldProps("description")} size="large"/>

                        {formik.errors.description && formik.touched.description && (
                            <div
                                className="text-sm text-red-600">
                                {formik.errors.description}
                            </div>
                        )}
                    </div>
                </form>


            </Modal>
        </>
    );

}