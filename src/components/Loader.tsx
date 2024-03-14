import React from "react";
import { LoaderCircle } from "lucide-react";

function Loader() {
	return (
		<div>
			<LoaderCircle className="animate-spin" />
		</div>
	);
}

export default Loader;
