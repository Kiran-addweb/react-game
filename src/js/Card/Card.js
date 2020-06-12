import React from "react";
import Image from "../Image";

export default function Card({ imageURL, isFlipped, onClick, emoji, color }) {
	console.log("color", color);

	return <div className="card-container" onClick={onClick}>
		<div className={"card" + (isFlipped ? " flipped" : "")}>

			<div className="side front" style={{ background: color ? color : '' }}>
				{/* <Image className="side front" src={imageURL} /> */}
				<text>{emoji}</text>
			</div>

			<div className="side back">
				<text>🙃</text>

			</div>
		</div>
	</div>;
}
