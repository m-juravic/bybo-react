import AddListingForm from "./AddListingForm"
import ListingSearch from "./ListingSearch"
import ListingList from "./ListingList"
import { useState, useEffect, useContext } from "react";
import ByboApi from "./api";
import { Spinner, Button } from "react-bootstrap";
import userContext from "./userContext";


/**
 * Shows all listings
 *
 * Prop:
 * -addUserListing
 *
 * State:
 * -listings
 * [{id, name, description, location, photo, price}, ...]
 *
 * RouteList => Listings
 */
function Listings({ addUserListing }) {
    const [listings, setListings] = useState({
        isLoading: true,
        data: null
    });
    const [isAdding, setIsAdding] = useState(false);
    //TODO: add search term state

    const { username } = useContext(userContext);

    useEffect(function fetchAndSetListings() {
        async function fetchListings() {
            const resp = await ByboApi.getAllListings();
            setListings(({
                isLoading: false,
                data: resp
            }))
        }
        fetchListings();
    }, []);

    /** Sets Listings "isAdding" state to false. */
    function toggleIsAdding() {
        setIsAdding(curr => !curr);
    }

    /** Adds a new listing to the current state */
    async function addNewListing(data) {
        const newListing = await ByboApi.addNewListing(data);

        setListings(curr => ({
            isLoading: false,
            data: [{
                id: newListing.id,
                name: newListing.name,
                description: newListing.description,
                location: newListing.location,
                photo: newListing.photo,
                price: newListing.price
            }, ...curr.data]
        }))
        addUserListing({
            description: newListing.description,
            location: newListing.location,
            id: newListing.id,
            name: newListing.name,
            price: newListing.price,
            photo: newListing.photo
        })
    }

    if (listings.isLoading) return <Spinner />;

    return (
        <div>
            {!isAdding && <div>
                {username &&
                    <>
                        <Button onClick={toggleIsAdding} variant="primary" type="submit">
                            Add new listing
                        </Button>
                    </>
                }
                <ListingSearch />
                <ListingList listings={listings.data} />
            </div>}
            {isAdding && <AddListingForm
                toggleIsAdding={toggleIsAdding}
                addNewListing={addNewListing}
            />}
        </div>
    )
}


export default Listings