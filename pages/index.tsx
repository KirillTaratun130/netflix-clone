import { getSession } from "next-auth/react";
import {NextPageContext} from "next";
import NavBar from "@/components/NavBar";
import Billboard from "@/components/Billboard";

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
        <Billboard />
    </>
  );
}
