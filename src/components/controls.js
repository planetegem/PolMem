import { useState, useEffect } from 'react';
import { animated, useTransition } from "@react-spring/web";

import { clockifyTime } from "../assets/helpers";

export default function ControlPanel({ time, state, stateChanger }){
    const [tutorial, setTutorial] = useState(false);
    const [render, setRender] = useState(0);

    // Timer: update every second
    useEffect(() => {
        if (time > 0 && state === "started"){
            const timer = setTimeout(() => {  
                setRender(render + 1); // and force rerender
            }, 1000);
            return() => clearTimeout(timer);
        }
    });
    // Timer face
    let clock;
    if (state === "paused"){
        clock = " paused ";
    } else if (state === "victory") {
        clock = "victory";
    } else {
        clock = clockifyTime(time ? Math.round((Date.now() - time)/1000) : 0);
    } 
    
    const tutorialAnimation = useTransition(tutorial, {
        from: {y: -1000},
        enter: {y: 0},
        leave: {y: -1000},
    });

    return(
        <div className="board-controls">
            <div className="tutorial-container">
                <button className="tutorial-button" onClick={() => setTutorial(!tutorial)}>?</button>
                {tutorialAnimation((style, item) =>
                    item
                    ?
                    <animated.div className="tutorial-overlay" onClick={() => setTutorial(!tutorial)} style={style} >
                        <div className="tutorial">
                            <h3>instructions</h3>
                            <ul>
                                <li>Click any card to turn it around</li>
                                <li>Find 2 matching cards to eliminate them</li>
                                <li>Click a card that's face-up to inspect it</li>
                                <li>Cards may trigger random events which alter the state of the board</li>
                                <li>Try and eliminate all politicians as quickly as possible</li>
                                <li>Discover every card and event to complete your inventory</li>
                            </ul>
                            <div className="continue-tutorial">
                                <span>-</span>
                                <span>click anywhere<br />to continue</span>
                                <span>-</span>
                            </div>
                        </div>
                    </animated.div>
                    :
                    null
                    )}
            </div>
            <div className={state === "victory" || state ==="paused" ? "victory timer" : "timer"}>
                <div>
                    <span>&nbsp;--&nbsp;</span>
                    <span className="displayed-time">{clock}</span>
                    <span>&nbsp;--&nbsp;</span>
                </div>
            </div>
            <button className="return-button" onClick={() => stateChanger("isDeciding")}>
                <h3>menu</h3>
                <img src="images/return-arrow.svg" alt=""></img>            
            </button>
        </div>
    );
}
