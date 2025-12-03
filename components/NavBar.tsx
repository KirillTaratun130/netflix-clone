import NavbarItem from "@/components/NavbarItem";
import MobileMenu from "@/components/MobileMenu";
import {useCallback, useState} from "react";

import { GoChevronDown } from "react-icons/go";
import { IoIosSearch } from "react-icons/io";
import { GoBell } from "react-icons/go";
import AccountMenu from "@/components/AccountMenu";



const NavBar = () => {
    const [showMobileMenu, setShowMobileMenu] = useState(false)
    const [showAccountMenu, setShowAccountMenu] = useState(false)

    const toggleMobileMenu = useCallback(() => {
        setShowMobileMenu((current) => !current)
    }, [])

    const toggleAccountMenu = useCallback(() => {
        setShowAccountMenu((current) => !current)
    }, [])

    return (
        <nav className="w-full fixed z-10">
            <div className="
            px-4
            md:px-16
            py-6
            flex
            flex-row
            items-center
            transition
            duration-500
            bg-zinc-900
            bg-opacity-90">
                <img className="h-8 lg:h-10" src="/images/logo.svg" alt="logo"/>
                <div className="flex-row ml-8 gap-7 hidden lg:flex">
                    <NavbarItem label="Home" />
                    <NavbarItem label="Series" />
                    <NavbarItem label="Films" />
                    <NavbarItem label="New & Popular" />
                    <NavbarItem label="My List" />
                    <NavbarItem label="Browse by languages" />
                </div>
                <div onClick={toggleMobileMenu} className="lg:hidden relative flex flex-row items-center gap-2 ml-8 cursor-pointer">
                    <p className="text-white text-sm">Browse</p>
                    <GoChevronDown className="text-white transition" />
                    <MobileMenu visible={showMobileMenu} />
                </div>
                <div className="flex flex-row items-center ml-auto gap-7">
                    <div className="text-gray-200 hover:text-gray-300 cursor-pointer transition">
                        <IoIosSearch className="text-2xl"/>
                    </div>
                    <div className="text-gray-200 hover:text-gray-300 cursor-pointer transition">
                        <GoBell className="text-2xl"/>
                    </div>
                    <div onClick={toggleAccountMenu} className="flex flex-row items-center gap-2 cursor-pointer relative">
                        <div className="w-6 h-6 lg:w-10 lg:h-10 rounded-md overflow-hidden">
                            <img src="/images/profiles/default-blue.png" alt="logo-profile"/>
                        </div>
                        <GoChevronDown className={`text-white transition ${showAccountMenu ? 'rotate-180' : 'rotate-0'} `} />
                        <AccountMenu visible={showAccountMenu} />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;