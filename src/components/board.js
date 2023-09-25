import { animated, useTransition, useSprings } from "@react-spring/web";
import "../css/game.css";

import Inspector from "./inspector";
import Victory from "./victory";
import EventBuilder from "./eventBuilder";

export default function Board({ deck, cardClicker, clickAllowed, event, exitEvent, coords, gameProgress, score, eventCount, stateChanger, renderer }){
    const inspectorTransition = useTransition(event.type === "inspector", {
        from: {opacity: 0},
        enter: {opacity: 1},
        leave: {opacity: 0},
    });
    const eventTransition = useTransition(event.type === "event", {
        from: {opacity: 0},
        enter: {opacity: 1},
        leave: {opacity: 0},
    });

    // VICTORY ANIMATION
    const victoryTransition = useTransition(gameProgress === "victory", {
        from: {y: 2000, opacity: 0},
        enter: {y: 0, opacity: 1, delay: deck.length*200 + 1500},
    });

    // CARD DEAL ANIMATION
    // eslint-disable-next-line
    const [springs, api] = useSprings(deck.length, (i) => ({
        from: {y: 100, opacity: 0},
        to: {y: 0, opacity: 1},
        delay: 500 + 90*i,
    }), []);

    // Calculate index (with hidden cards)
    function calculateIndex(index){
        let counter = 0;
        for (let i = index; i >= 0; i--){
            if (deck[i].hidden){
                counter++;
            }
        }
        return index - counter + 1;
    }
    
    return(
        <>
        <div className="board">
            {springs.map((props, index) => {
                return(
                    <animated.div style={props} key={deck[index].key + index} className={deck[index].gone ? "gone" : ""}>
                    {!deck[index].hidden
                    ?
                    <Card  
                        cardId={deck[index].name} 
                        front={deck[index].src}
                        back={deck[index].backside}
                        clicker={ (e) => {
                            // SAVE CLICK COORDINATES FOR INSPECTOR ANIMATION
                            let xPos = e.clientX,
                                yPos = e.clientY;

                            cardClicker(index, xPos, yPos);
                        }}
                        classProp={
                            "card" + 
                            (deck[index].isTurned ? " turned": "") + 
                            (clickAllowed ? " clickable" : " unclickable")
                        }
                        inPlay={deck[index].inPlay}
                        index={calculateIndex(index)}
                    />
                    :
                    null
                    }
                    </animated.div>
                );
            })
        }
        {victoryTransition((style, item) =>
            item 
            ?
            <animated.div style={style} className="victory-screen">
                <Victory score={score} stateChanger={stateChanger} eventCount={eventCount} />
            </animated.div>
            :
            null
        )}
        </div>
        {inspectorTransition((style, item) =>
            item
            ?
            <animated.div style={style} className="overlay">
                <Inspector card={event.card} returnHandler={exitEvent} coords={coords} />
            </animated.div>
            :
            null
        )}
        {eventTransition((style, item) =>
            item
            ?
            <animated.div style={style} className="event-builder">
                    <EventBuilder event={event.event} deck={deck} returnHandler={exitEvent} renderer={renderer} />
            </animated.div>
            :
            null
        )}
        </>
    );
}
function Card({ cardId, front, back, clicker, classProp, inPlay, index }){
       return(
        <div className={classProp} onClick={clicker} >
            <span>{index}</span>
            <img src={front} alt={cardId} className={ inPlay ? "front" : "front found"} ></img>
            <img src={back} alt="Logo" className={ inPlay ? "back" : "back found"}></img>
        </div>
    )
}
