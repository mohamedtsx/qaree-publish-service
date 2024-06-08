import { ConnectWithPayPal } from "@/components/ConnectWithPayPal";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { fetcher } from "@/lib/graphql/fetcher";
import {
	getMerchantStatusQuery,
	getSignupActionURLQuery,
} from "@/lib/graphql/queries";
import Image from "next/image";

const getData = async () => {
	try {
		const { getMerchantStatus } = await fetcher({
			query: getMerchantStatusQuery,
			server: true,
		});

		if (!getMerchantStatus) {
			throw Error("Error: GetMerchantStatus");
		}

		if (getMerchantStatus?.paymentsReceivable) {
			return {
				merchanStatus: getMerchantStatus,
			};
		}
		const { getSignupActionURL } = await fetcher({
			query: getSignupActionURLQuery,
			server: true,
		});

		return {
			signUpUrl: getSignupActionURL?.actionURL as string,
		};
	} catch (error) {
		if (process.env.NODE_ENV === "development") {
			console.log(error);
		}
	}
};

export default async function Royalties() {
	const data = await getData();
	if (!data?.merchanStatus && !data?.signUpUrl) {
		return <div>There`re development error!</div>;
	}
	const { merchanStatus, signUpUrl } = data;

	return (
		<div>
			<Card>
				<CardHeader>
					<Image
						src={"/assets/paypal.svg"}
						alt="PayPal"
						width={170}
						height={48}
					/>
				</CardHeader>
				<CardContent>
					{merchanStatus ? (
						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<span className="font-semibold">Status: </span>
								<Badge className="uppercase">Active</Badge>
							</div>
							<div className="">
								<span className="font-semibold">Merchan Id:</span>{" "}
								<text>{merchanStatus.merchantId}</text>
							</div>
						</div>
					) : (
						<div>
							<ul className="list-disc list-inside mb-8 text-muted-foreground">
								<li>Something should be written here</li>
								<li>I don`t know what to write</li>
								<li>Another list item to fill the space</li>
								<li>Don`t forget to update this data with real one</li>
							</ul>
							<ConnectWithPayPal url={signUpUrl} />
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
