import React from "react"
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import XIcon from '@mui/icons-material/X';
export default function Footer () {
    return (
        <>
            <footer className="flex flex-col items-center bg-zinc-900">
                <ul className="flex flex-row my-4">
                    <li className="text-white mx-4 cursor-pointer"><a href="https://www.linkedin.com/in/yashpal-singh-chouhan-907819224"><LinkedInIcon/></a></li>
                    <li className="text-white mx-4 cursor-pointer"><a href="https://github.com/Yashpalsinghchouhan11"><GitHubIcon/></a></li>
                    <li className="text-white mx-4 cursor-pointer"><a href="https://x.com/Yashpal_11"><XIcon/></a></li>
                </ul>
                <p className="text-white my-2 max-md:max-w-44 max-md:text-center">
                    <span className="">© 2024 InterviewEase </span>
                    <span className=""> All Rights Reserved </span>
                    <span className=""> 123 Indore India</span>
                </p>
            </footer>
        </>
    )
}