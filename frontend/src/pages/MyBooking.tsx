import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import { useMutation, useQueryClient } from "react-query";
import { useAppContext } from "../contexts/AppContext";
import { useSearchContext } from "../contexts/SearchContext";

const MyBookings = () => {
  const { data: hotels } = useQuery(
    "fetchMyBookings",
    apiClient.fetchMyBookings
  );

  const queryClient = useQueryClient();
  const { showToast } = useAppContext();
  const search = useSearchContext();
  const deleteBookingMutation = useMutation(
    ({ hotelId, bookingId }: { hotelId: string, bookingId: string }) => apiClient.deleteBooking(hotelId, bookingId),
    {
      onSuccess: () => {
        showToast({ message: "Booking deleted successfully", type: "SUCCESS" });
        queryClient.invalidateQueries("fetchMyBookings");
      },
      onError: (error: Error) => {
        showToast({ message: error.message, type: "ERROR" });
      },
    }
  );
  function calculateDifferenceInDays(startDateString: Date, endDateString: Date): number {
    // Convert date strings from `YYYY/MM/DD` format to `YYYY-MM-DD` format
    const formattedStartDateString: string = startDateString.toISOString().slice(0,10);
    const formattedEndDateString: string = endDateString.toISOString().slice(0,10);
  
    // Parse the date strings using the formatted format
    const startDate: Date = new Date(formattedStartDateString);
    const endDate: Date = new Date(formattedEndDateString);
  
    // Calculate the difference in time in milliseconds
    const differenceInTime: number = endDate.getTime() - startDate.getTime();
  
    // Convert the difference from milliseconds to days
    const differenceInDays: number = differenceInTime / (1000 * 60 * 60 * 24);
    return differenceInDays;
}

const startDate: Date = search.checkIn;
const endDate: Date = search.checkOut;
const differenceInDays: number = calculateDifferenceInDays(startDate, endDate);

  

  const handleDelete = async (hotelId: string, bookingId: string) => {
    try {
      await deleteBookingMutation.mutateAsync({ hotelId, bookingId });

    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  if (!hotels || hotels.length === 0) {
    return <span>No bookings found</span>;
  }

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">My Bookings</h1>
      {hotels.map((hotel) => (
        <div key={hotel._id} className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] border border-slate-300 rounded-lg p-8 gap-5">
          <div className="lg:w-full lg:h-[250px]">
            <img src={hotel.imageUrls[0]} className="w-full h-full object-cover object-center" alt={hotel.name} />
          </div>
          <div className="flex flex-col gap-4 overflow-y-auto max-h-[300px]">
            <div className="text-2xl font-bold">
              {hotel.name}
              <div className="text-xs font-normal">
                {hotel.city}, {hotel.country}
              </div>
            </div>
            {hotel.bookings.map((booking) => (
              <div key={booking._id}>
                <div>
                  <span className="font-bold mr-2">Dates: </span>
                  <span>{new Date(booking.checkIn).toDateString()} - {new Date(booking.checkOut).toDateString()}</span>
                </div>
                <div>
                  <span className="font-bold mr-2">Guests:</span>
                  <span>{booking.adultCount} adults, {booking.childCount} children</span>
                </div>
       
                <button style={ { padding: '10px'}} className="bg-red-600 text-white p-2 rounded-lg  gap-5 mt-10" onClick={() => handleDelete(hotel._id, booking._id)}>
                  Cancel Booking 
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyBookings;
