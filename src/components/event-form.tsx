/* eslint-disable @next/next/no-img-element */
import { useState } from "react";

type Inputs = {
    event_name: string,
    event_image: File
};

const EventForm = () => {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [eventName, setEventName] = useState<string>("");
    console.log(eventName) // watch input value by passing the name of it
    return (
        /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
        <div className="flex flex-col bg-black-opaque mb-10 rounded-md p-10 w-[60vw] max-w-[900px] min-w-[500px]">
            <form onSubmit={(event) => {
                alert(`Create event [${eventName}]`);
                event.preventDefault();
            }}>
                <div className="flex items-center justify-center">
                    {selectedImage && (
                        <div>
                            <div className="flex items-center justify-center">
                                <img className="rounded-full border-2 border-gray-300" alt="not fount" width={"150px"} src={URL.createObjectURL(selectedImage)} />

                            </div>
                        </div>
                    )}
                    {!selectedImage && (<div>
                        <div className="flex justify-center items-center w-full">
                            <label htmlFor="dropzone-file" className="flex flex-col justify-center items-center w-full w-64 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                <div className="flex flex-col justify-center items-center pt-5 pb-6">
                                    <svg aria-hidden="true" className="mb-3 w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG</p>
                                </div>
                                <input id="dropzone-file" type="file" className="hidden" onChange={(event) => {
                                    if (!event.target.files) return;
                                    console.log(event.target.files[0]);
                                    setSelectedImage(event.target.files[0]);
                                }} />
                            </label>
                        </div>
                        <br />
                    </div>
                    )}
                </div>
                <br />
                <div className="relative z-0 mb-6 w-full group">
                    <input defaultValue="" onChange={(event) => {
                        setEventName(event.target.value);
                    }} className="block py-2.5 px-0 w-full text-2l text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                    <label htmlFor="floating_email" className="peer-focus:font-medium absolute text-2l text-gray-600 dark:text-gray-300 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Event Name</label>
                </div>

                <div className="flex items-center justify-center">
                    <button type="submit" className="justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                </div>
            </form>
        </div>
    );
}

export default EventForm;
