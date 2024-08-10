"use client";

import Image from "next/image";
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { Avatar } from "../user_profile/avatar";
import { useContext } from "react";
import AuthContext from "@/context/app.context";
import { UserInfo } from "@/models/user-info";
import { styled } from '@mui/system';
import { BorderAll, Padding } from "@mui/icons-material";

const CustomInput = styled(InputBase)(({ theme }) => ({
    '& .MuiInputBase-input::placeholder': {
        color: 'white', // Change this to your desired color
        opacity: 1,   // Ensures the color is fully applied
        fontStyle: 'bold', // Example of additional styling
    }, '.MuiInputBase-input': {
        color: 'white',
        fontStyle: 'bold',
        fontSize: '1.5rem',
        border: '1px solid black',
        borderRadius: '25px',
        padding: '5px 15px',
    }
}));

export default function NavBar() {
    const userContext: UserInfo | undefined = useContext(AuthContext);

    return (
        <div className="p-[25px] bg-[#0085FF]" style={
            {
                backgroundColor: "0085FF"
            }
        }>

            <div className="flex flex-row justify-between">
                <div className="flex flex-row gap-4 items-center drake-banner w-[400px] pl-6">
                    <div className="banner-wrapper flex flex-row gap-4 justify-center">
                        <Image src={"/images/bjk-letter-logo-design-on-black-background-bjk-creative-initials-letter-logo-concept-bjk-letter-design-vector.jpg"} width={50} height={50} alt="logo" />
                        <h1 className="text-2xl self-center text-white">Shining Phu Ho</h1>
                    </div>
                </div>

                <div className="search-area  pl-[50px] flex items-center w-[700px]">
                    <div className="search-area-wrapper w-full">
                        <CustomInput
                            maxRows={10}
                            fullWidth={true}
                            sx={{ ml: 1, flex: 1 }}

                            placeholder="Find Anything..."
                            inputProps={{ 'aria-label': 'search google maps', 'color': 'white' }}
                        />
                    </div>
                    <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                        <SearchIcon />
                    </IconButton>
                </div>
                <div className="avatar-section w-[300px] ">
                    {
                        userContext == null ? <div className="flex flex-row gap-4">
                            <button className="btn">Login</button>
                            <button className="btn">Register</button>
                        </div> : <div className="flex flex-row gap-4 grow justify-end  ">
                            <Avatar avatar={userContext.avatar}
                                username={userContext.username}
                                email={userContext.email}
                            />
                        </div>
                    }
                </div>
            </div>

        </div>
    );
}
