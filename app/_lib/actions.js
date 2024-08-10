"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import { getBookings } from "./data-service";
import { redirect } from "next/navigation";
import { stringify } from "postcss";

export async function updateGuest(formData) {
	const session = await auth();
	if (!session) throw new Error("You must be logged in");

	const nationalID = formData.get("nationalID");
	const [nationality, countryFlag] = formData.get("nationality").split("%");

	if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID))
		throw new Error("Please provide a valid national ID");

	const updateData = { nationalID, nationality, countryFlag };

	const { data, error } = await supabase
		.from("guests")
		.update(updateData)
		.eq("id", session.user.guestId);

	if (error) throw new Error("Guest could not be updated");

	//since profile page is dynamic so cache is of 30 seconds, to imemdiatly revalidate data use revalidatePath
	revalidatePath("/account/profile");
}

export async function deleteReservation(bookingId) {
	//check if user is authenticated
	const session = await auth();
	if (!session) throw new Error("You must be logged in");

	//user can only be able to delete his bookings
	const guestBookings = await getBookings(session.user.guestId);
	const guestBookingIds = guestBookings.map((booking) => booking.id);

	if (!guestBookingIds.includes(bookingId))
		throw new Error("You are not allowed to delete this booking");

	const { error } = await supabase
		.from("bookings")
		.delete()
		.eq("id", bookingId);

	if (error) {
		throw new Error("Booking could not be deleted");
	}

	revalidatePath("/account/reservations");
}

export async function editReservations(formData) {
	//1) Authenticaion
	const session = await auth();
	if (!session) throw new Error("You must be logged in");

	const bookingId = Number(formData.get("bookingId"));

	//2) Authorization
	const guestBookings = await getBookings(session.user.guestId);
	const guestBookingIds = guestBookings.map((booking) => booking.id);

	if (!guestBookingIds.includes(bookingId))
		throw new Error("You are not allowed to update this booking");

	//3) Building update data

	const numGuests = Number(formData.get("numGuests"));
	const observations = formData.get("observations").split(0, 1000).at(0);

	const updateData = { numGuests, observations };

	//4) Mutaion
	const { error } = await supabase
		.from("bookings")
		.update(updateData)
		.eq("id", bookingId);

	//5) Error handling
	if (error) {
		throw new Error("Booking could not be updated");
	}

	revalidatePath(`/account/reservations/edit/${bookingId}`);

	//Redirecting
	redirect("/account/reservations");
}

export async function signInAction() {
	await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
	await signOut({ redirectTo: "/" });
}
