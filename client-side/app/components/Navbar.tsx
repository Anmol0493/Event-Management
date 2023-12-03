import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MdAccountCircle } from "react-icons/md";

const Navbar = () => {
    return (
        <div className="navbar bg-base-100 flex flex-col md:flex-row justify-between items-center px-4 bg-gradient-to-r from-[#5b5bc2] to-[#7790ff] pb-2">
            <div className="flex items-center mb-4 md:mb-0">
                <Link href="/">
                    <Image src="/images/logo.png" width={130} height={100} alt="Event Management Logo" />
                </Link>
            </div>
            <div>
                <ul className="menu menu-horizontal items-center flex space-x-4 md:space-x-4 mt-1">
                    <li>
                        <Link href="/view-expenses" legacyBehavior>
                            <a className="btn-like">View Expenses</a>
                        </Link>
                    </li>
                    <li>
                        <Link href="/add-expense" legacyBehavior>
                            <a className="btn-like">Add Expense</a>
                        </Link>
                    </li>
                    <li>
                        <Link href="/account" legacyBehavior>
                            <a className="btn">
                                <MdAccountCircle size={35} />
                            </a>
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Navbar;