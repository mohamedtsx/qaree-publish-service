import { LoaderCircle } from "lucide-react";
import React from "react";

function Loader() {
	return (
		<div>
			<LoaderCircle className="animate-spin" />
		</div>
	);
}

export default Loader;
