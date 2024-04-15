import PublishBookForm from "@/components/PublishBookForm";
import { PublishFormContextProvider } from "@/context";
import React from "react";

function Publish() {
	return (
		<div className="container py-16">
			<PublishFormContextProvider>
				<PublishBookForm />
			</PublishFormContextProvider>
		</div>
	);
}

export default Publish;
