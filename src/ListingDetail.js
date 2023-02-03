import { useState, useEffect, useContext } from "react"
import { useParams, Link } from "react-router-dom";
import ByboApi from "./api";
import { Spinner, Card, Button, Stack } from "react-bootstrap";
import userContext from "./userContext";

/**
 * TODO:
 */
function ListingDetail({ addUserBooking }) {
    const [listing, setListing] = useState({
        data: null,
        isLoading: true
    })
    const [bookings, setBookings] = useState([
        { code: 0, name: "Sunday", status: "available" },
        { code: 1, name: "Monday", status: "available" },
        { code: 2, name: "Tuesday", status: "available" },
        { code: 3, name: "Wednesday", status: "available" },
        { code: 4, name: "Thursday", status: "available" },
        { code: 5, name: "Friday", status: "available" },
        { code: 6, name: "Saturday", status: "available" },
    ])

    // const sampleBookings = [0, 2, 3]

    console.log("listing", listing);

    const { listingId } = useParams();

    const { id } = useContext(userContext);

    useEffect(function fetchAndSetListing() {
        async function fetchListing() {
            const resp = await ByboApi.getListingDetail(listingId);
            setListing(({
                isLoading: false,
                data: resp
            }))
        }
        fetchListing();
    }, []);

    useEffect(function fetchAndSetBooking() {
        async function fetchBooking() {
            // TODO: update this from sampleBookigns to actual listing state data
            setBookings(curr => curr.map(b => {
                console.log("listing in fetch booking", listing);
                if (listing.data.bookings.includes(b.code)) {
                    return {
                        ...b,
                        status: "booked"
                    };
                }
                return b;
            }))
        }

        if (listing.isLoading === false) {
            fetchBooking();
        }
    }, [listing])

    /** Handles clicking a day button, updating it's state to be selected */
    function handleDayButtonClick(evt) {
        console.log(evt.target.id);

        setBookings(curr => curr.map(b => {
            if (b.code === +evt.target.id) {
                return {
                    ...b,
                    status: "clicked"
                };
            }
            return b;
        }))
    }

    /** Handles clicking the book it button, add new bookings. */
    async function addNewBooking(evt) {

        const days = bookings.filter(b => {
            return b.status === "clicked"
        }).map(b => {
            return b.code
        })

        /** returns an array of days */
        const updatedBookings = await ByboApi.createNewBooking(listingId, { user_id: id, days })

        const bookingObjects = updatedBookings.map(b => {
            return {
                day: b,
                description: listing.data.description,
                id: listing.data.id,
                location: listing.data.location,
                name: listing.data.name,
                photo: listing.data.photo,
                price: listing.data.price
            }
        })

        addUserBooking(bookingObjects);

        setBookings(curr => curr.map(b => {
            if (updatedBookings.includes(b.code)) {
                return {
                    ...b,
                    status: "booked"
                };
            }
            return b;
        }))
    }

    if (listing.isLoading) return <Spinner />;

    const l = listing.data;

    return (
        <Card>
            <Card.Body>
                <Card.Title>{l.name}</Card.Title>
                <Card.Text>hosted by <Link to={`/users/${l.host.id}`}>
                    {l.host.username}</Link>  | {l.location}</Card.Text>
                <Card.Img variant="left" width="600px" src={l.photo} />
                <Card.Text>{l.description}</Card.Text>
                <Card.Text>
                    {l.has_pool && "Pool! "}
                    {l.has_barbecue && "Barbecue! "}
                    {l.is_fenced && "Fenced!"}
                </Card.Text>
                <Card.Text>Size: {l.size}</Card.Text>
                <Card.Text>{l.price} per hour</Card.Text>
                <Stack direction="horizontal" gap={2} >
                    {listing.data.host.id !== id && bookings.map(b => (
                        <div key={b.code}>
                            {b.status === "available" &&
                                <Button
                                    id={b.code}
                                    variant="outline-primary"
                                    onClick={handleDayButtonClick}
                                >
                                    {b.name}
                                </Button>
                            }
                            {b.status === "booked" &&
                                <Button
                                    id={b.code}
                                    variant="outline-secondary"
                                    disabled
                                    onClick={handleDayButtonClick}
                                >
                                    {b.name}
                                </Button>
                            }
                            {b.status === "clicked" &&
                                <Button
                                    id={b.code}
                                    variant="primary"
                                    onClick={handleDayButtonClick}
                                >
                                    {b.name}
                                </Button>
                            }
                        </div>
                    ))}
                </Stack>
                {listing.data.host.id !== id &&
                    <div>
                        <Button
                            onClick={addNewBooking}
                            variant="info">
                            Book'em Dano!
                        </Button>
                    </div>
                }
            </Card.Body>
        </Card>
    )
}


export default ListingDetail

/*
steps for booking a listing:
- render a set of buttons at the bottom of listing, one for each day of week
-   if a day has been booked (i.e. in listing state), render it disabled
- add'l button to "book" the selected days
- clicking on a button will just select that day (modify some state of selected days)
- clicking "book" button will send api request to book those days

scenarios:
- no one has booked any days: all buttons are available to click
- ANYONE has booked days: those are disabled, rest are available to click
*/