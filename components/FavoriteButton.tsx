import axios from "axios";
import React, {FC, useCallback, useMemo} from 'react';

import { FaPlus, FaCheck } from "react-icons/fa6";

import useFavorites from "@/hooks/useFavorites";
import useCurrentUser from "@/hooks/useCurrentUser";

interface IFavoriteButtonProps {
    movieId: string
}

const FavoriteButton: FC<IFavoriteButtonProps> = ({ movieId }) => {
    const { mutate: mutateFavorites } = useFavorites()
    const { data: currentUser, mutate } = useCurrentUser()

    const isFavorite = useMemo(() => {
        const list = currentUser?.favoriteIds || []

        return list.includes(movieId)
    }, [currentUser, movieId])

    const toggleFavorites = useCallback(async () => {
        let response;
        if (isFavorite) {
            response = await axios.delete('/api/favorite', { data: { movieId } })
            console.log(response)
        } else {
            response = await axios.post('/api/favorite', { movieId })
            console.log(response)
        }

        const updatedFavoriteIds = response?.data?.favoriteIds

        mutate({
            ...currentUser,
            favoriteIds: updatedFavoriteIds
        })

        mutateFavorites()
    }, [movieId, isFavorite, currentUser, mutate, mutateFavorites])

    const Icon = isFavorite ? FaCheck : FaPlus


    return (
        <div onClick={toggleFavorites} className='
        cursor-pointer
        group/item
        w-6 h-6
        lg:w-10 lg:h-10
        border-white
        border-2
        rounded-full
        flex
        justify-center
        items-center
        transition
        hover:border-neutral-300
        '>
            <Icon color='white' />
        </div>
    );
};

export default FavoriteButton;