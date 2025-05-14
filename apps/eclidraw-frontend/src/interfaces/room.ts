export type RoomFormFormikType = {
  slug: string;
  description: string;
};

export interface RoomType {
  id: string;
  slug: string;
  description: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    photo: string | null;
  };
}

export interface RoomReduxStateType {
  roomFormLoading: boolean;
  roomFormError: string | undefined;
}

export type RoomCardPropsType = RoomType;
