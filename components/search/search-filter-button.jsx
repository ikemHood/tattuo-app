'use client'

import clsx from "clsx";
import { useState } from "react";
import { Button } from "../ui/button";
import { FilterIcon } from "lucide-react";
import { useClickOutside } from "@/hooks/use-click-outside";
import { useSearchParamsFilter } from "@/hooks/useSearchParamsFilter";

const SearchFilterButton = ({
    title = 'Filtros',
    options = [],     // name of the searchParam that the button should stablish in the url
    searchParamName,
}) => {

    const [show, setShow] = useState(false); // should we show the menu?
    const {selected, toggleSelectedFilter } = useSearchParamsFilter(searchParamName);
    const menuRef = useClickOutside(()=>setShow(false), ["click"])

    return (
        <div className="relative z-10"
            ref={menuRef}
        >
            <Button className="  
                relative
                flex flex-row gap-2
                "
                variant="secondary"
                onClick={() => setShow(!show)}
            >

                <FilterIcon size={20} />
                <p className=''>
                    {title}
                </p>
                {
                    selected.length > 0 &&
                    <div className="bg-primary/30 rounded-full px-2 py-1 text-xs
                    absolute right-0 -bottom-1.5
                    "
                    // TODO: make it change to cross to delete all the filter of the button when clicked
                    // onClick={(event) => {
                    //     alert("hello")
                    // }}
                    >
                        {selected.length}
                    </div>
                }
            </Button>
            <div className="absolute mt-3">
                {show && <div className="bg-background border-border border rounded-md shadow-md p-2 min-w-[200px]">
                    {options.map((option, index) => (
                        <div key={option.label} className={clsx(`
                        px-5 
                        py-2 
                        hover:bg-secondary 
                        cursor-pointer
                        rounded-md
                        ${selected.includes(option.label) && `bg-secondary`}
                        ${selected.includes(option.label) && `font-bold`}
                        
                        
                        `)}


                            onClick={() => toggleSelectedFilter(option.label)}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>}


            </div>


        </div>
    )
};
export default SearchFilterButton;