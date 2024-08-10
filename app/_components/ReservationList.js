"use client";

import { deleteReservation } from "../_lib/actions";
import ReservationCard from "./ReservationCard";
import { useOptimistic } from "react";
function ReservationList({ bookings }) {
	const [optimisticBookings, optimisticDelete] = useOptimistic(
		bookings,
		(currBookings, bookingId) => {
			return currBookings.filter((booking) => booking.id !== bookingId);
		}
	);
	async function handleDelete(bookingId) {
		//optimistically deleting
		optimisticDelete(bookingId);

		//actually deleting on server
		await deleteReservation(bookingId);
	}
	return (
		<ul className="space-y-6">
			{optimisticBookings.map((booking) => (
				<ReservationCard
					booking={booking}
					onDelete={handleDelete}
					key={booking.id}
				/>
			))}
		</ul>
	);
}

export default ReservationList;
