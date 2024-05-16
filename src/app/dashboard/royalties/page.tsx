import { Button, buttonVariants } from "@/components/ui/button";
import { fetcher } from "@/lib/graphql/fetcher";
import {
	getMerchantStatusQuery,
	getSellerOnboardingStatusQuery,
	getSignupActionURLQuery,
	userInfoQuery,
} from "@/lib/graphql/queries";
import Link from "next/link";
import React from "react";
import Script from "next/script";

const getData = async (): Promise<{
	url: string;
	isConnected: boolean;
}> => {
	const { getSignupActionURL } = await fetcher({
		query: getSignupActionURLQuery,
		server: true,
	});

	const { userInfo } = await fetcher({
		query: userInfoQuery,
		server: true,
	});

	const id = userInfo?._id as string;

	const { getSellerOnboardingStatus } = await fetcher({
		query: getSellerOnboardingStatusQuery,
		variables: {
			trackingId: id,
		},
		server: true,
	});

	// const { getMerchantStatus } = await fetcher({
	// 	query: getMerchantStatusQuery,
	// 	server: true,
	// });

	return {
		url: getSignupActionURL?.actionURL as string,
		isConnected: false,
	};
};

export default async function Royalties() {
	// const { url, isConnected } = await getData();
	const { url, isConnected } = { url: "", isConnected: false };

	return (
		<div className="h-svh flex items-center justify-center">
			{/* <pre>{JSON.stringify(getMerchantStatusQuery, null, 2)}</pre> */}
			{!isConnected ? (
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
					>
						Connect to paypal
					</Link>
				</div>
			) : (
				<>Active</>
			)}
		</div>
	);
}

// pubcom2023@gmail.com
// Publish14rC0mp@ny2o2

// mohamedali00949@gmail.com
// mohamedali00949
