import { getArtists } from '@/actions/getArtists'
import { getCurrentUser } from '@/actions/getCurrentUser'
import ArtistCard from '@/components/listings/artist-card'
import Container from '@/components/ui/container'
import { getStyleList } from '@/lib/getStyleList'
import { getCities } from '@/lib/getCities'
// import ListingGridWithInfinite from '@/components/listings/ListingGridWithInfinite'
import Heading from '@/components/heading'
import EmptyState from '@/components/empty-state'
import ListingGrid from '@/components/listings/listing-grid'
import { Separator } from '@/components/ui/separator'
import SearchBar from '@/components/search/search-bar'
import FreeSearch from '@/components/search/free-search'
import SearchFilterButton from '@/components/search/search-filter-button'
import InfiniteListingGrid from '@/components/listings/infinite-listing-grid'
import { getArtistsByCityName } from '@/actions/getArtistsByCityName'
import AsyncSelect from '@/components/async-select'
import CitiesAsyncSelect from '@/components/cities-async-select'
export const dynamic = "force-dynamic";


//TODO:
// SITEMAP
// ROBOTS.TXT

const styles = getStyleList()
const cities = getCities()

const filtro1 = {
    label: 'Estilos',
    value: 'styles',
    options: styles
}

const filtro2 = {
    label: 'Ciudad',
    value: 'city',
    options: cities
}
const endpoint = 'http://localhost:3000/api/artists'

const numberOfPagesToLoad = 1
const sizePerPage = 5
const initialDataSize = (numberOfPagesToLoad * sizePerPage)

export default async function ArtistPage({ searchParams }) {

    const artists = await getArtists(
        searchParams,
        0,
        initialDataSize
    )


    const currentUser = await getCurrentUser()


    const serverLoadedArtists = artists.slice(0, initialDataSize)
    const serverHasMoreArtists = artists.length > initialDataSize




    if (artists.length < 1) {
        return (
            <Container>
                <SearchBar>
                    <FreeSearch />
                    <div className='flex flex-row gap-2'>
                        <SearchFilterButton title={filtro1.label} options={filtro1.options} searchParamName={filtro1.value} />
                        <CitiesAsyncSelect searchParamName="city" />
                        {/* Eventually, I will change the city select for an async select */}
                    </div>
                </SearchBar>
                <EmptyState title="No se han encontrado tatuadores con esos filtros"
                    subtitle="Modifica tus filtros para encontrar más resultados"
                    actionUrl={'/tatuadores'}
                    actionLabel={'Quitar filtros'}
                />
            </Container>
        )
    }

    return (
        <Container>
            {/* <Search filtro1={filtro1} filtro2={filtro2} /> */}
            {/* <ListingGridWithInfinite // to render an infinite scroll we need...
                initialData={serverLoadedArtists} // the initial data coming from the server
                sizePerPage={sizePerPage} // the size of each page
                endpoint={endpoint}  // the endpoint to fetch more data in a client component
                hasMore={serverHasMoreArtists} // if there are more items to load
                Component={ArtistCard} // the component to render for each item
                keyProp="artist" // the key prop to use to identify each item
                currentUser={currentUser} // the current user to check if the user is logged in
            >

            </ListingGridWithInfinite> */}

            <Heading title={"Descubre tatuadores"}
                subtitle={"Explora por estilo, parte del cuerpo, o simplemente escribe lo que buscas"}
            />
            <Separator className="my-5" />

            <SearchBar>
                <FreeSearch />
                <div className='flex flex-row gap-2'>
                    <SearchFilterButton title={filtro1.label} options={filtro1.options} searchParamName={filtro1.value} />
                    <CitiesAsyncSelect searchParamName="city" />
                    {/* <SearchFilterButton title={filtro2.label} options={filtro2.options} searchParamName={filtro2.value} /> */}
                    {/* Eventually, I will change the city select for an async select */}
                </div>
            </SearchBar>

            {/* <ListingGrid>
                {serverLoadedArtists.map((artist) => {
                    return (
                        <ArtistCard currentUser={currentUser} data={artist} key={artist.id} />
                    )
                })}
            </ListingGrid> */}

            <InfiniteListingGrid // to render an infinite scroll we need...
                initialData={serverLoadedArtists} // the initial data coming from the server
                sizePerPage={sizePerPage} // the size of each page
                endpoint={endpoint}  // the endpoint to fetch more data in a client component
                hasMore={serverHasMoreArtists} // if there are more items to load
                Component={ArtistCard} // the component to render for each item
                keyProp="artist" // the key prop to use to identify each item
                currentUser={currentUser} // the current user to check if the user is logged in
            >
            </InfiniteListingGrid>
        </Container>
    )
}
