'use client'

import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { BoardAdder } from "./board-adder";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import axios from "axios";
import { useToast } from "../ui/use-toast";
import HeartButton from "../heart-button";
import path from "path";


export default function TattooCard({
    currentUser,
    data,
    className,
    hasBoardAdder = true,
    likeable = true,
    children,
    ...props
}) {

    const { toast } = useToast()

    const router = useRouter()

    const onBoardCreate = useCallback((title) => {
        return axios.post('/api/boards', { title: title })
            .then(res => {
                toast({
                    title: `Tablero ${title} creado`,
                    description: "Hemos añadido el tatuaje a tu tablero. ¡Sigue añadiendo más tatuajes!",
                })
                router.refresh()
                return res.data
            })
            .catch(err => {
                // toast.error('Something went wrong')
            }
            )

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router])


    const onBoardSelect = useCallback((tattoo, board) => {
        // add the tattoo to the board


        axios.post(`/api/boards/${board.id}/tattoos`, { tattooId: tattoo.id })
            .then(res => {
                console.log("response data:", res.data)
                toast({
                    title: `Tablero añadido el tatuaje a ${board.title}`,
                    description: "Puedes seguir añadiendo más tatuajes",

                })
            })
            .catch(err => {
                console.log("ERROR - TattooCard", err)
                toast({
                    title: `No ha sido posible añadir el tatuaje a ${board.title}`,
                    description: `${err.response.data.error}`,
                    variant: "destructive"

                })
            }
            )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div
            className="cursor-pointer"

            onClick={(event) => {
                if ((event.target.id !== "tattoo-image" && event.target !== path)) {
                    event.preventDefault()
                } else {
                    router.push(`/tatuajes/detalle/${data.id}`)
                }
            }}>

            <Card className={cn(`
                    w-full
                    min-w-[150px]
                    aspect-square
                    relative
                    overflow-hidden
                    group
                    `,
                className
            )}>
                <CardContent className="grid gap-4">
                    <Image src={data.imageSrc} fill alt={"tattoo"} className="object-cover" id="tattoo-image" />
                    <div className="absolute bottom-0 w-full">
                        {children}
                    </div>
                    {
                        hasBoardAdder &&

                        <div className="absolute bottom-2">
                            <BoardAdder
                                tattoo={data}
                                currentUser={currentUser}
                                boards={currentUser?.boards || []}
                                onBoardCreate={onBoardCreate}
                                onBoardSelect={onBoardSelect}
                                className="
                        sm:bg-transparent sm:text-transparent sm:border-none
                        group-hover:bg-background
                        group-hover:text-primary
                        group-hover:border-border

                        " />
                        </div>
                    }

                    {
                        likeable &&
                        <div className="hidden group-hover:block absolute right-2 top-2 p-3" >
                            <HeartButton listingId={data.id} currentUser={currentUser} listingType={"tattoos"} />
                        </div>

                    }
                </CardContent>
            </Card>
        </div>

    );
}