import prisma from "@/lib/prismadb";

// get all the boards of the current user
/**
 * 
 * @param {import("@prisma/client").User} user  
 * @returns {Promise<(import("@prisma/client").User & { tattoos: import("@prisma/client").Tattoo[] })[] | null>}
 */
export async function getBoardsOfUser(user) {

    try {

        if (!user) {
            return null;
        }

        const boards = await prisma.tattooBoard.findMany({
            where: {
                userId: user.id
            },
            include: {
                tattoos: true
            }
        }
        );

        if (!boards) {
            return [];
        }

        return boards;
    } catch (error) {
        console.log("ERROR - getBoardsOfUser", error)
        return [];
    }

}

