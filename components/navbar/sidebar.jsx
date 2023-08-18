'use client'

import { LogOut, Menu } from "lucide-react";
import { Button } from "../ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import MenuItem from "../ui/menu-item";
import { artistMenuItems, clientMenuItems } from "@/lib/const";
import { Separator } from "../ui/separator";
import Logo from "./logo";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { signOut } from 'next-auth/react';
import { UiContext } from "@/providers/ui/ui-provider";
import GradientBorder from "../uiEffects/gradient-border";


export default function Sidebar({
    currentUser
}) {


    const { setLoginModalOpen, sidebarOpen, setSidebarOpen, setArtistRegisterOpen } = useContext(UiContext)

    const router = useRouter()


    return (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild className="">
                <Menu className="cursor-pointer"
                    onClick={() => { setSidebarOpen(true) }} />
            </SheetTrigger>
            <SheetContent className={"flex flex-col justify-start"}>
                <div className="flex flex-col my-2">
                    <SheetHeader>
                        <SheetTitle asChild><Logo /></SheetTitle>
                        <SheetDescription className="hidden sm:block">
                            Descubre nuevos tatuadores. Guarda inspiración. Contacta con ellos.
                            Bienvenidx a TATTUO
                        </SheetDescription>
                    </SheetHeader>
                    <Separator className="my-2 sm:my-5" />
                    {
                        artistMenuItems.map((el) => (
                            <MenuItem label={el.label} onClick={() => {
                                router.push(el.url)
                                setSidebarOpen(false)


                            }} key={el.label} />
                        ))
                    }
                    <Separator className="my-1" />
                    {
                        clientMenuItems.map((el) => (
                            <MenuItem label={el.label} onClick={() => {
                                router.push(el.url)
                                setSidebarOpen(false)


                            }} key={el.label} />
                        ))
                    }

                    <Separator className="my-1" />
                </div>
                <SheetFooter>
                    <div className="w-full text-center">

                        {
                            currentUser ?
                                <Button variant="ghost" className="flex flex-row justify-center gap-2"
                                    onClick={() => {
                                        signOut()
                                        router.refresh()
                                    }}>
                                    <LogOut />
                                    <p>Salir de mi cuenta</p>
                                </Button>
                                :
                                <div>
                                    <div className="flex flex-col items-center space-y-3">
                                        <p>Para poder guardar tus favoritos y contactar con los artistas</p>

                                        <GradientBorder>
                                            <Button
                                                onClick={() => { setLoginModalOpen(true) }}

                                                className="z-10 
                                                            w-[95%]
                                                            h-[86%]
                                                            hover:bg-primary
                                                            focus:!ring-offset-0
                                                            focus:!ring-0
          "
                                            >
                                                Entra
                                            </Button>
                                        </GradientBorder>
                                        {/* <p>
                                            ¿Aún no tienes cuenta?
                                        </p>
                                        <Button variant="" className="w-fit"
                                            onClick={() => { setLoginModalOpen(true) }}
                                        >Regístrate</Button> */}
                                    </div>
                                    <div className="flex flex-col items-center space-y-2">
                                        <p>
                                            ¿Eres tatuador?
                                        </p>
                                        <Button variant="outline"
                                            onClick={() => {
                                                console.log("clicked")
                                                setArtistRegisterOpen(true)
                                            }}
                                            className="w-fit">Publica</Button>


                                    </div>

                                </div>
                        }
                    </div>

                </SheetFooter>
            </SheetContent>


        </Sheet>

    );
}