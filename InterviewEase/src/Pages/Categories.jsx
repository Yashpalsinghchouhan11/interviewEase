    import React from "react";
    import { Link } from "react-router-dom";
    import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
    import {useDispatch} from 'react-redux'
    import { useState } from "react";
    import { useSearchParams } from "react-router-dom";

    export default function Category(){
        const categories = [['PY','Python Developer'], ['DS','Data Science'], ['DA','Data Analytics'], ['JS','JavaScript Developer'], ['HR','Human Resource']]
        const dispatch = useDispatch()
        const [searchParams, setSearchParams] = useSearchParams();
        const handleOnClick = (e) =>{
            const event = e.currentTarget.getAttribute('data')
            setSearchParams({domain:event})
        }
        
        return(
            <>
                <div className="h-screen flex bg-slate-100 justify-center items-center mt-16">
                    <div className=" max-w-md  flex flex-col">
                        <h1 className="text-gray-600 text-xl text-center mt-8 mb-8 max-sm:text-md">What field do you want to practice for ?</h1>
                        <div className="w-full flex flex-col my-8">
                            {categories.map((category, index) =>(
                                <Link to={`/category/domain?domain=${category[0]}`} className="bg-white px-4 py-3 my-2 mx-1 rounded-lg hover:drop-shadow-2xl" onClick={handleOnClick} key={index} data={category[0]}>{category[1]}<span className="float-end"><KeyboardArrowRightIcon/></span></Link>
                            ))}
                        </div>
                    </div>
                </div>
            </>
        )
    }