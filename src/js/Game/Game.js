import React, { useEffect, useState } from "react";
import uuid from "uuid";
import emojis from "../../emojis";
import Card from "../Card/Card";
import deepcopy from "deepcopy";

function shuffleArray(array) {
	return array.sort(() => .5 - Math.random());
}

function generateCards(count) {
	if (count % 2 !== 0) {
		alert("Count must be even: 2, 4, 6, etc. but it is " + count);
		throw "Count must be even: 2, 4, 6, etc. but it is " + count;

	}

	const cards = shuffleArray(emojis)
		.slice(0, count / 2)
		.map(imageURL => ({
			id: uuid.v4(),
			imageURL: "static/images/cards/" + imageURL,
			emoji: imageURL,
			isFlipped: true,
			canFlip: true,
			color: ""
		}))
		.flatMap(e => [e, { ...deepcopy(e), id: uuid.v4() }]);
	return shuffleArray(cards);
}

export default function Game({ fieldWidth = 4, fieldHeight = 4 }) {
	const totalCards = fieldWidth * fieldHeight;
	const [cards, setCards] = useState(generateCards(totalCards));
	const [canFlip, setCanFlip] = useState(false);
	const [firstCard, setFirstCard] = useState(null);
	const [secondCard, setSecondCard] = useState(null);

	function setCardIsFlipped(cardID, isFlipped) {
		setCards(prev => prev.map(c => {
			if (c.id !== cardID) {
				c.color = c.color != "green" ? "" : "green";
				return c;
			}
			return { ...c, isFlipped };
		}));
	}
	function setCardColor(cardID, cardID2) {
		setCards(prev => prev.map(c => {
			if (c.id === cardID || cardID2 == c.id) {
				c.color = "green";
				c.emoji = ""
				return c;
			}
			return { ...c };
		}));
	}
	function setCardCanFlip(cardID, canFlip) {
		setCards(prev => prev.map(c => {
			if (c.id !== cardID) {
				c.color = c.color != "green" ? "" : "green";
				return c;
			}
			return { ...c, canFlip };
		}));
	}

	// showcase
	useEffect(() => {
		setTimeout(() => {
			let index = 0;
			for (const card of cards) {
				// setTimeout(() => setCardIsFlipped(card.id, true), index++ * 100);
			}
			setTimeout(() => setCanFlip(true), cards.length * 100);
		}, 3000);
	}, []);

	function resetFirstAndSecondCards() {
		setFirstCard(null);
		setSecondCard(null);
	}

	function onSuccessGuess() {
		setCardCanFlip(firstCard.id, false);
		setCardCanFlip(secondCard.id, false);
		setCardIsFlipped(firstCard.id, false);
		setCardIsFlipped(secondCard.id, false);
		setCardColor(firstCard.id, secondCard.id);
		resetFirstAndSecondCards();
	}
	function onFailureGuess() {
		const firstCardID = firstCard.id;
		const secondCardID = secondCard.id;
		setCards(prev => prev.map(c => {
			if (c.id === firstCardID) {
				c.color = "red";
				return c;
			}
			if (c.id === secondCardID) {
				c.color = "red";
				return c;
			}
			return { ...c };
		}));

		setTimeout(() => {
			setCardIsFlipped(firstCardID, true);
		}, 1000);
		setTimeout(() => {
			setCardIsFlipped(secondCardID, true);
		}, 1200);

		resetFirstAndSecondCards();
	}

	useEffect(() => {
		if (!firstCard || !secondCard)
			return;

		(firstCard.imageURL === secondCard.imageURL) ? onSuccessGuess() : onFailureGuess();

	}, [firstCard, secondCard]);


	function onCardClick(card) {
		if (!canFlip)
			return;
		if (!card.canFlip)
			return;

		if ((firstCard && (card.id === firstCard.id) || (secondCard && (card.id === secondCard.id))))
			return;

		setCardIsFlipped(card.id, false);

		(firstCard) ? setSecondCard(card) : setFirstCard(card);
	}
	// let styleContent = `#grid {display: -ms-grid; -ms-grid-columns: (auto)[${fieldWidth}]; -ms-grid-rows: (1fr)[${fieldHeight}];}`;
	return <div className="game container-md">
		<div className="cards-container" style={{ "grid-template-columns": "repeat(" + fieldWidth + ", auto)", "grid-template-rows": "repeat(" + fieldHeight + ", 1fr)" }} >
			{cards.map(card => <Card onClick={() => onCardClick(card)} key={card.id} {...card} />)}
		</div>
	</div >;
}
