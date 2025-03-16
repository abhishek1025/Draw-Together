import { JSX } from "react";

export default async function Await<T>({
  promise,
  children,
}: {
  promise: Promise<T>;
  children: (value: T) => JSX.Element;
}) {
  try {
    const data = await promise;

    if (data === null) {
      throw new Error("Unexpected Error occurred. Please try again later.");
    }
    return children(data);
  } catch (error) {
    const errMessage =
      error instanceof Error
        ? error.message
        : "Unexpected Error occurred. Please try again later";

    return (
      <div className="p-4 text-white bg-red-600 rounded"> {errMessage} </div>
    );
  }
}
