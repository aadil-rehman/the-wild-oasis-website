import { auth } from "@/app/_lib/auth";

export const middleware = auth;

//middleware runs before every route render - by using matcher we limited it to run only before /account route
export const config = {
	matcher: ["/account"],
};
