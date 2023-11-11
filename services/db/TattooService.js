import prisma from "@/lib/prismadb";

export class TattooService {
  static async getByBoardId(boardId) {
    const boardTattoos = await prisma.boardTattoo.findMany({
      where: {
        boardId,
      },
      include: {
        tattoo: true,
      },
    });
    const tattoosArray = boardTattoos.map((boardTattoo) => boardTattoo.tattoo);
    return tattoosArray;
  }

  static async getByArtistId(artistId) {
    const tattoos = await prisma.tattoo.findMany({
      where: {
        artistProfileId: artistId,
      },
    });
    if (!tattoos) {
      return null;
    }
    return tattoos;
  }

  static async getPaginated(searchParams, skip = 0, take = undefined) {
    const query = this.#buildQuery(searchParams);
    const tattoos = await prisma.tattoo.findMany({
      where: query,
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
      skip,
      take: take, // fetch 'take + 1' items, so we know if there are more items to fetch
    });
    return tattoos;
  }

  static async getById(
    id,
    {
      includeArtistProfile = true,
      includeLikes = true,
      includeStyle = true,
      includeTags = true,
    } = {},
  ) {
    const tattoo = await prisma.tattoo.findUnique({
      where: {
        id,
      },
      include: {
        artistProfile: includeArtistProfile,
        likes: includeLikes,
        style: includeStyle,
        tags: {
          include: {
            tag: includeTags,
          },
        },
      },
    });

    return tattoo;
  }

  static async getSimilar(tattoo) {
    const similarTattoos = await prisma.tattoo.findMany({
      where: {
        OR: [
          {
            artistProfileId: {
              equals: tattoo.artistProfileId,
            },
            id: {
              not: tattoo.id,
            },
          },
        ],
      },
      include: {
        artistProfile: {
          select: {
            id: true,
            artisticName: true,
            // avatar: true
          },
        },
        tags: {
          select: {
            tag: {
              select: {
                label: true,
              },
            },
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
      },
    });
    return similarTattoos;
  }

  static async create({
    title,
    description,
    imageSrc,
    category,
    location,
    style,
    bodyPart,
    artistProfile,
    tags,
  }) {
    const listing = await prisma.tattoo.create({
      data: {
        title,
        description,
        imageSrc,
        category,
        location,
        style: {
          connect: { id: style.id },
        },
        bodyPart: {
          connect: { id: bodyPart.id },
        },
        artistProfile: {
          connect: { id: artistProfile.id },
        },
        tags: {
          create: tags.map((tag) => ({
            tag: { connect: { id: tag.id } },
          })),
        },
      },
    });

    return listing;
  }

  static async update(oldData, updatedData) {
    const currentTagIds = oldData.tags.map((t) => t.tag.id);
    const updatedTagIds = updatedData.tags.map((t) => t.id);

    // Identify tags to be added and removed
    const tagsToAdd = updatedData.tags.filter(
      (tag) => !currentTagIds.includes(tag.id),
    );
    const tagsToRemove = oldData.tags.filter(
      (taggedTattoo) => !updatedTagIds.includes(taggedTattoo.tag.id),
    );

    console.log({ oldData });
    // Build the Prisma update query
    const updateQuery = {
      where: {
        id: oldData.id,
      },
      data: {
        title: updatedData.title,
        description: updatedData.description,
        imageSrc: updatedData.imageSrc,
        category: updatedData.category,
        location: updatedData.location,
        style: {
          connect: { id: updatedData.style.id },
        },
        bodyPart: {
          connect: { id: updatedData.bodyPart.id },
        },
        artistProfile: {
          connect: { id: updatedData.artistProfile.id },
        },
      },
    };

    // Add connect operations for tags to be added
    if (tagsToAdd.length > 0) {
      updateQuery.data.tags = {
        // This is not a "tag", this is a "TaggedTattoo"...
        create: tagsToAdd.map((tag) => ({
          // so for each tag in tagsToAdd we create a new "TaggedTattoo", not a new tag!
          tag: {
            // in that tagged tattoo, the tag property is the connections...
            connect: { id: tag.id }, // when the selected tag id
          },
        })),
      };
    }

    // Build the operations to execute in the transaction
    const operations = [
      prisma.tattoo.update(updateQuery),
      ...tagsToRemove.map((taggedTattoo) =>
        prisma.taggedTattoo.delete({
          where: {
            id: taggedTattoo.id, // is this ok? the tattoo remains pointint to a taggedTattoo that no longer exists?
          },
        }),
      ),
    ];

    // Execute the transaction
    const transactionResult = await prisma.$transaction(operations);

    return transactionResult[0];
  }

  //
  //
  // ###############
  // PRIVATE METHODS
  // ###############

  static #private(id) {
    return;
  }

  static #buildQuery(searchParams) {
    const { userId, style, bodyPart, freeSearch, contentSlug } = searchParams;

    // ### SEARCH FUNCTIONALITY ###
    // // we are building the query object for prisma
    let query = {};

    // // conditionally add properties to the query object...

    const stylesArray = style?.split(",").map((style) => style.trim());

    if (stylesArray && stylesArray.length > 0) {
      query.style = {
        label: {
          in: stylesArray,
        },
      };
    }

    const bodyPartsArray = bodyPart
      ?.split(",")
      .map((bodyPart) => bodyPart.trim());

    if (bodyPartsArray && bodyPartsArray.length > 0) {
      query.bodyPart = {
        label: {
          in: bodyPartsArray,
          mode: "insensitive",
        },
      };
    }

    // create a query that returns the tattoos that match the search in the title or description
    if (freeSearch) {
      query = {
        ...query,
        OR: [
          {
            title: {
              contains: freeSearch,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: freeSearch,
              mode: "insensitive",
            },
          },
          {
            tags: {
              some: {
                tag: {
                  label: {
                    contains: freeSearch,
                    mode: "insensitive",
                  },
                },
              },
            },
          },
        ],
      };
    }

    if (contentSlug) {
      query = {
        AND: [
          { ...query },
          {
            tags: {
              some: {
                tag: {
                  label: {
                    contains: contentSlug,
                    mode: "insensitive",
                  },
                },
              },
            },
          },
        ],
      };
    }

    return query;
  }
}