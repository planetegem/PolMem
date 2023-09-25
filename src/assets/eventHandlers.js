const eventHandlers = {
    shuffle: (deck, event) => {
        for (let i = deck.length - 1; i > 0; i--){
            let randomIndex = Math.floor(Math.random()*(i + 1));
            let temp = deck[randomIndex];
            deck[randomIndex] = deck[i];
            deck[i] = temp;
        }
        return (deck, event);
    },
    undo: (deck, event) => {
        let removedCards = deck.filter(card => !card.inPlay);
        if (removedCards.length > 0){
            let selection = removedCards[Math.floor(Math.random()*removedCards.length)];
            deck.map((card) => {
                if (card.key === selection.key){
                    card.inPlay = true;
                }
                return card;
            });
        }
        for (let card of deck){
            if (card.inPlay){
                card.isTurned = false;
            }
        }
        return (deck, event);
    },
    add: (deck, event) => {
        deck.map(card => {
            if (card.key === event.card){
                card.hidden = false;
            }
            return card;
        });
        return (deck, event);
    },
    comeback: (deck, event) => {
        let targets = [];
        deck.forEach((card, index) => {
            if (card.key === event.card){
                targets.push(index);
            }
        });
        targets.forEach(i => {
            deck[i].inPlay = true;
            deck[i].isTurned = false;

            let newIndex = Math.floor(Math.random()*deck.length),
                temp = deck[newIndex];
            deck[newIndex] = deck[i];
            deck[i] = temp;
        });
    }
}
export default eventHandlers;