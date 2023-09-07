'use client'

import useSave from "@/hooks/useSave";
import { BookMarked } from "lucide-react";

const SaveButton = ({
    listingId,
    currentUser,
    listingType = "artists",
}) => {

    const { hasSaved, toggleSave } = useSave({
        listingId,
        currentUser,
        listingType,
    })


    return (
        <div
            onClick={toggleSave}
            className="relative transition cursor-pointer hover:opacity-80"
        >

            <BookMarked
                size={24}
                className={
                    hasSaved ? 'fill-black stroke-white' : 'fill-neutral-500/30'
                } />

        </div>
    )
};

export default SaveButton