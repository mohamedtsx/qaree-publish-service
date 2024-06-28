import { ConnectWithPayPal } from "@/components/ConnectWithPayPal";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { fetcher } from "@/lib/graphql/fetcher";
import {
  getMerchantIdQuery,
  getMerchantStatusQuery,
  getSignupActionURLQuery,
} from "@/lib/graphql/queries";
import Image from "next/image";

const getData = async () => {
  try {
    const { userInfo } = await fetcher({
      query: getMerchantIdQuery,
      server: true,
      revalidate: 0,
    });

    if (!userInfo) {
      throw Error("Error: GetMerchantStatus");
    }

    if (userInfo?.merchantId) {
      return {
        merchantId: userInfo.merchantId as string,
      };
    }

    try {
      const { getMerchantStatus } = await fetcher({
        query: getMerchantStatusQuery,
        server: true,
        revalidate: 0,
      });

      if (getMerchantStatus?.merchantId) {
        return {
          merchantId: userInfo.merchantId as string,
        };
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.log(error);
      }
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

  if (!data?.merchantId && !data?.signUpUrl) {
    return <div>Try to refresh the page</div>;
  }

  const { merchantId, signUpUrl } = data;

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
          {merchantId ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Status: </span>
                <Badge className="uppercase">Active</Badge>
              </div>
              <div className="">
                <span className="font-semibold">Merchan Id:</span>{" "}
                <text>{merchantId}</text>
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
              <ConnectWithPayPal url={signUpUrl as string} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
