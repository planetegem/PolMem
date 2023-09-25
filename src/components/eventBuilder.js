import { useState, useEffect } from 'react';
import { animated, useTransition } from "@react-spring/web";
import "../css/event.css";

import eventHandlers from '../assets/eventHandlers';

export default function EventBuilder({ event, deck, returnHandler, renderer }){
    const [phase, setPhase] = useState("swirl");

    useEffect(() => {
        const timer = setTimeout(() => {      
            setPhase("continue"); //
        }, 3000);
        return() => clearTimeout(timer);
    }, []);

    const introduction = useTransition((phase === "swirl" || phase === "continue"), {
        from: {opacity: 1},
        enter: {opacity: 1},
        leave: {opacity: 0},
    });
    const body = useTransition(phase === "event", {
        from: {opacity: 0, y: 200},
        enter: {opacity: 1, y: 0},
        leave: {opacity: 0, y: 0},
    })

    function launchEvent(){
        for (let card of deck){
            if (card.inPlay){
                card.isTurned = false;
            }
        }

        // Perform deck manipulation
        let type = event.type;
        eventHandlers[type](deck, event);
        renderer();
        
        setPhase("event");
    }

    return(
        <div className="overlay" onClick={(phase === "continue") ? launchEvent : null}>
        {introduction((style, item) =>
            item
            ?
            <animated.div style={style} className="brainswirl-container">
            <div className="brainswirl">
                <img src="images/event-brain.png" alt="RANDOM EVENT!" className="back"></img>
                <img src="images/event-swirl.png" alt="RANDOM EVENT!" className="middle"></img>
                <img src="images/event-text.png" alt="RANDOM EVENT!" className="front"></img>
            </div>
            <span className={(phase === "continue") ? "continue" : ""}>- click to continue -</span>
            </animated.div>
            : 
            null
        )}
        {body((style, item) => 
            item
            ?
            <animated.div style={style} className="event-container">
                <div className="event-details">
                    <h3>{event.name}</h3>
                    <p>{event.description}</p>
                    <div className="event-effect">
                        <h4>effect:</h4>
                        <h4>{event.effect}</h4>
                    </div>
                    <button className="button" onClick={returnHandler}>understood</button>
                </div>
                <img src={event.src} alt={event.name}></img>
                
            </animated.div>
            : 
            null
        )}
        </div>
    );
}