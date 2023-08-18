import { NextResponse } from "next/server";
import { getCurrentUser } from "@/actions/getCurrentUser";
import prisma from "@/lib/prismadb";


export async function PUT(request) {


    const currentUser = await getCurrentUser(request);

    if (!currentUser) {
        return NextResponse.json({ error: 'Not logged in' }, { status: 401 })
    }

    if (currentUser.role !== 'ARTIST') {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
    }

    // search the artistId of the current user
    const artistProfile = await prisma.artistProfile.findUnique({
        where: {
            id: currentUser.artistProfileId
        }
    })

    // check that the user that is trying to edit the artist profile is the owner of the artist profile
    if (artistProfile.userId !== currentUser.id) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
    }


    const body = await request.json();

    const updatedInfo = { ...body }

    const styleIds = updatedInfo.styles.map(style => {
        return style.id
    })

    console.log("STYLES", styleIds)

    // print on the console the styles array



    // delete the property "city" of the updatedInfo object
    delete updatedInfo.styles
    const cityId = updatedInfo.city.id
    delete updatedInfo.city
    updatedInfo.minWorkPrice = parseInt(updatedInfo.minWorkPrice)
    updatedInfo.pricePerHour = parseInt(updatedInfo.pricePerHour)
    updatedInfo.pricePerSession = parseInt(updatedInfo.pricePerSession)
    updatedInfo.socials = {
        set:
            [
                { network: "facebook", profile: updatedInfo.facebook },
                { network: "instagram", profile: updatedInfo.instagram },
                { network: "tiktok", profile: updatedInfo.tiktok },
                { network: "twitter", profile: updatedInfo.twitter }
            ]
    }

    // TODO: if profile is complete, set isComplete to true
    if (true) {
        updatedInfo.isComplete = true
    }

    // find and update the artist profile and connect the city
    const updatedArtistProfile = await prisma.artistProfile.update({
        where: {
            id: currentUser.artistProfileId
        },
        data: {
            ...updatedInfo,
            city: { connect: { id: cityId } },
            styles: {
                set: [], // clear existing relations
                connect: styleIds.map((styleId) => ({ id: styleId })), // establish new relations
            },
        }
    })

    return NextResponse.json(updatedArtistProfile)
}