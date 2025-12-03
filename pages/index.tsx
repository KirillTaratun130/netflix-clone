import {getSession, signOut} from "next-auth/react";
import {NextPageContext} from "next";
import NavBar from "@/components/NavBar";

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
  return (
    <>
        <NavBar />
    </>
  );
}
