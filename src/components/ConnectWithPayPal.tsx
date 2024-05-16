import React from "react";
import Script from "next/script";
import Link from "next/link";
import { buttonVariants } from "./ui/button";

export const ConnectWithPayPal = ({ url }: { url: string }) => {
	return (
		<div>
			<Script
				id="paypal-js"
				src="https://www.paypal.com/webapps/merchantboarding/js/lib/lightbox/partner.js"
			/>
			<Link
				href={`${url}&displayMode=minibrowser`}
				className={buttonVariants({
					size: "lg",
				})}
				target="PPFrame"
				data-paypal-button="true"
			>
				Connect with PayPal
			</Link>
		</div>
	);
};
