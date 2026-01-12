import { getSession } from "next-auth/react";
import {NextPageContext} from "next";
import NavBar from "@/components/NavBar";
import Billboard from "@/components/Billboard";
import MovieList from "@/components/MovieList";
import useMovieList from "@/hooks/useMovieList";
import useFavorites from "@/hooks/useFavorites";
import InfoModal from "@/components/InfoModal";
import useInfoModal from "@/hooks/useInfoModal";

// Функция для редиректа не авторизованных пользователей на /auth
export async function getServerSideProps(context: NextPageContext) {
    const session = await getSession(context)

    if (!session) {
        return {
            redirect: {
                destination: '/auth',
                permanent: false
            }
        }
    }
    return {
        props: {}
    }
}

export default function Home() {
    const { data: movies = [] } = useMovieList()
    const { data: favorites = [] } = useFavorites()
    const { isOpen, closeModal } = useInfoModal()

  return (
    <>
        <InfoModal visible={isOpen} onClose={closeModal} />
        <NavBar />
        <Billboard />
        <div className='pb-40'>
            <MovieList data={ movies } title='Trending Now' />
            <MovieList data={ favorites } title='My List' />
        </div>
    </>
  );
}
