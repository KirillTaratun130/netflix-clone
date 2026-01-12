import React, {FC} from 'react';
import { useRouter } from "next/router";

import { IoPlay } from "react-icons/io5";

interface PlayButtonProps {
    movieId: string
}

const PlayButton:FC<PlayButtonProps> = ({ movieId }) => {
    const router = useRouter();


    return (
        <button onClick={() => router.push(`/watch/${movieId}`)} className='
        bg-white
        rounded-md
        py-1 md:py-2
        px-2 md:px-4
        w-auto
        text-xs lg:text-lg
        font-semibold
        flex
        flex-row
        items-center
        hover:bg-neutral-300
        transition'>
            <IoPlay className='mr-1' />
            Play
        </button>
    );
};

export default PlayButton;