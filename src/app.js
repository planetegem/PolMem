import { useState, useEffect, useRef } from 'react';
import { animated, useTransition } from "@react-spring/web";

import Cards from "./assets/cards";
import Events from "./assets/eventDescriptions";
import { double, shuffle } from "./assets/helpers";

import LoaderWidget from "./loaderWidget/widget";
import Menu from "./components/menu";
import Board from "./components/board";
import ControlPanel from "./components/controls";
import Inventory from "./components/inventory";
import InfoScreen from "./components/info";

export default function App(){
    // Keep track of where we are in flow
    const [user, setUser] = useState("isLoading");

    // Force render during gameplay
    const [render, setRender] = useState(0);
    function renderer(){
        setRender(render + 1);
    }

    // GAME VARIABLES
    const card1 = useRef(null); // Remembers selected card
    const card2 = useRef(null); // Remembers 2nd selected card
    const event = useRef({type: "none", card: null, event: null}); // Remembers event triggered
    const interactionAllowed = useRef(true); // Prevent double execution

    const deck = useRef([]); // Base deck, saved to local storage
    const board = useRef([]); // Cards on board, can be modified during gameplay   
    
    const events = useRef([]); // Event base, saved to local storage
    const eventsCopy = useRef([]); // Copy to be modfied during gameplay
    const previousEvent = useRef(); // Timestamp of previous event (to avoid overload of events)
    const eventCounter = useRef(0); // Running tally

    const history = useRef([]); // Game history (for recap)
    const starttime = useRef(); // Start time
    const gamestate = useRef("waiting"); // Keep track of timer during gameplay

    // GAME PREP: LOCALSTORAGE & COPIES
    function loadDecks(){
        starttime.current = null;
        history.current = null;
        previousEvent.current = null;
        eventCounter.current = 0;

        // Check if there is deck in localStorage; if not: create one
        if (localStorage.getItem("deck") === null){
            deck.current = Cards;
            deck.current.map((card) => {
                return (
                    card.discovered = false
                );
            });
            localStorage.setItem("deck", JSON.stringify(deck.current));

            events.current = Events;
            events.current.map((event) => {
                return (
                    event.discovered = false
                );
            });
            localStorage.setItem("events", JSON.stringify(events.current));

            localStorage.setItem("games", 0);
            localStorage.setItem("bestTime", "/");

        } else {
            deck.current = JSON.parse(localStorage.getItem("deck"));
            events.current = JSON.parse(localStorage.getItem("events"));
        }

        // Make deep copy of deck and prepare for gameplay
        board.current = double(deck.current);
        board.current.map((card, index) => {
            let random = Math.random();
            const back = (random > 0.5) ? "images/card.svg" : "images/card-alt.svg";
            return (
                card.backside = back,
                card.isTurned = false,
                card.inPlay = true,
                card.revealed = false,
                card.gone = false
            );
        });
        // Make deep copy of events array for modification during gameplay
        eventsCopy.current = events.current.map(event => {
            return JSON.parse(JSON.stringify(event));
        });
    }
    function clearStorage(){
        localStorage.clear();
        card1.current = null;
        card2.current = null;
        gamestate.current = "waiting";
        loadDecks();
        setUser("isDeciding");
    }

    // FIRST MOUNT: START GAME & PRELOAD IMAGES
    useEffect(() => {
        loadDecks();
        // Array of images
        let srcArray = [
            "images/arrow.svg", "images/card.svg", "images/card-alt.svg", "images/card-hidden.svg",
            "images/eb-logo.svg", "images/pm_main.png", "images/recycle.svg", "images/return-arrow.svg",
            "images/event-brain.png", "images/event-text.png", "images/event-swirl.png",
        ];
        for (let src of deck.current){
            srcArray.push(src.src);
        }
        for (let src of events.current){
            srcArray.push(src.src);
        }
        // Preload all images
        async function loadImages(images){
            const start = Date.now();
            const promises = await images.map((image) => {
                return new Promise(function(resolve, reject){
                    const img = new Image();
                    img.onload = () => {
                        console.log("Loaded " + img.src);
                        resolve(img);
                    }
                    img.onerror = () => {
                        console.log("Failed to load " + img.src);
                        reject();
                    }
                    img.src = image;
                });
            });
            await Promise.all(promises);
            setTimeout(() => {
                const end = Date.now();
                console.log("Loading completed after " + (end - start) +"ms.");
                setUser("isDeciding");
            }, 1500);
        }
        loadImages(srcArray);
    }, []);

    // CHECK FOR VICTORY RESET
    if (user === "isDeciding" && gamestate.current === "victory"){
        gamestate.current = "waiting";
        loadDecks();
    }

    // PAUSE MECHANIC
    const paused = useRef(0); // Keep track of when game was paused
    if (user === "isDeciding" && gamestate.current === "started"){
        gamestate.current = "paused";
        paused.current = Date.now();
    }
    // Unpause when returning from menu
    useEffect(() => {
        if (user === "isPlaying" && gamestate.current === "paused"){
            let diff = Date.now() - paused.current;
            paused.current = 0;

            starttime.current = starttime.current + diff;
            gamestate.current = "started";
        }
    }, [user]);
    
    // EVENT LOGIC
    function considerEvent(){
        // Check when was last event
        const elapsed = (Date.now() - previousEvent.current)/1000;

        // Make array of possible events
        let possibleEvents = eventsCopy.current.map((event) => {
            let index = board.current.findIndex((element) => element.name === event.politician),
            politician = board.current[index];
                            
            // Event is valid if politician has been seen
            let valid = true;
            if (event.condition === "exists"){
                valid = politician.inPlay ? true : false;
                valid = politician.revealed ? valid : false;
            } else if (event.condition === "removed"){
                valid = politician.inPlay ? false : true;
            }
            return(valid ? event : null);
        });
        possibleEvents = possibleEvents.filter(item => item);
                
        // Attempt to trigger random event
        if (possibleEvents.length > 0){
            let currentEvent = possibleEvents[Math.floor(Math.random()*possibleEvents.length)];
                
            let chance = Math.min((elapsed / currentEvent.mtth)*100 - 20, currentEvent.max),
                random = Math.ceil(Math.random()*100);
                                
            console.log(chance + "% chance to start " + currentEvent.name);    
            if (random > (100 - chance)){
                event.current = {type: "none", card: event.current.card, event: currentEvent};
                gamestate.current = "paused";
                return true;
            } else {
                return false;
            }
        }
    }
    function exitEvent() {
        if (event.current.type === "event"){
            card1.current = null;
            card2.current = null;

            eventCounter.current++;
            previousEvent.current = Date.now();

            let currentEvent = event.current.event;
            let currentIndex = events.current.findIndex(item => currentEvent.key === item.key);
            events.current[currentIndex].discovered = true;
            localStorage.setItem("events", JSON.stringify(events.current));

            // increase mtth to generate more diversity in events
            currentEvent.mtth += 10;
        
            // If not repeatable, remove event from game
            if (!currentEvent.repeat){
                let target = eventsCopy.current.findIndex((element) => element.key === currentEvent.key);
                eventsCopy.current.splice(target, 1);          
            }
            // Keep score for final screen
            let currentTime = Date.now() - starttime.current;
            if (!history.current){
                history.current = [[currentEvent, currentTime]];
            } else {
                history.current.push([currentEvent, currentTime]);
            }
        }

        // Clear everything
        event.current.type = "none";
        interactionAllowed.current = true;
        gamestate.current = "started";

        setRender(render + 1);
    }

    // CLICKHANDLER: CLICKER SAVES INDEX IN MEMORY OR STARTS INSPECTOR
    const clickPosition = useRef({x: 0, y: 0});

    function cardClicker(i, xPos, yPos){
        // Keep track of click coordinates for animation
        clickPosition.current = {x: xPos, y: yPos};

        if (interactionAllowed){
            // Start game on first click
            if (!starttime.current){
                starttime.current = Date.now();
                previousEvent.current = starttime.current;
                gamestate.current = "started";
            }
            // Decide what to do with click
            if (board.current[i].isTurned){
                // Inspect card
                event.current = {type: "inspector", card: board.current[i], event: event.current.event};
                interactionAllowed.current = false;
                gamestate.current = "paused";

                setRender(render + 1);
                return;

            } else if (card1.current === null){
                card1.current = i;
                interactionAllowed.current = false;

                setRender(render + 1);
                return;

            } else if (card2.current === null) {        
                card2.current = i;
                interactionAllowed.current = false;

                setRender(render + 1);
                return;
            }
        }
    }

    function markDiscovered(card){
        for (let otherCard of board.current){
            if (otherCard.key === card.key){
                otherCard.discovered = true;
            }
        }
        // Mark as discovered in source deck
        let index = deck.current.findIndex((element) => element.key === card.key);
        deck.current[index].discovered = true;
        localStorage.setItem("deck", JSON.stringify(deck.current));
    }

    function victory(){
        card1.current = null;
        card2.current = null;
        gamestate.current = "victory";

        // Update local storage on victory
        localStorage.setItem("deck", JSON.stringify(deck.current));
        localStorage.games++;

        let victoryTime = (Date.now() - starttime.current)/1000,
            tempTime = localStorage.getItem("bestTime");
        if (tempTime !== "/"){
            victoryTime = (victoryTime < tempTime) ? victoryTime : tempTime;
        } 
        localStorage.setItem("bestTime", victoryTime);
                        
        // Run victory animation
        let order = new Array(board.current.length).fill(null).map((item, index) => {return index});
        order = shuffle(order);

        for (let i = 0; i < order.length; i++){
            setTimeout(() => {
                let index = order[i];
                board.current[index].gone = true;
                setRender(render + i);
            }, 150*i + 1000);
        }
    }

    // CHECK MEMORY EVERY RENDER AND DECIDE WHAT TO DO
    function checkMemory(){
        // If event in memory, return early
        if (event.current.type !== "none" || gamestate.current === "victory"){
            return;
        }
        // Otherwise compare cards
        if (card1.current !== null){
            const left = board.current[card1.current];
            left.isTurned = true;
            left.revealed = true;

            if (!left.discovered){
                markDiscovered(left);
            }
    
            if (card2.current !== null){
                const right = board.current[card2.current];
                right.isTurned = true;
                right.revealed = true;

                if (!right.discovered){
                    markDiscovered(right);
                }
                
                if (left.key === right.key){ // If cards are the same: remove from play
                    left.inPlay = false;
                    right.inPlay = false;
                                     
                    // Keep score for final screen
                    let currentTime = Date.now() - starttime.current;
                    if (!history.current){
                        history.current = [[left, currentTime]];
                    } else {
                        history.current.push([left, currentTime]);
                    }
                    // Check for victory
                    let counter = 0;
                    for (let card of board.current){
                        if (card.inPlay && !card.hidden) {
                            counter++;
                        }
                    }
                    if (counter === 0){
                        victory();
                        return;
                    }
                    setTimeout(() => {
                        interactionAllowed.current = true;
                        card1.current = null;
                        card2.current = null;
                        setRender(render + 1);
                    }, 200);

                } else { // Else: clear memory, turn cards & consider starting event
                    setTimeout(() => {
                        // Turn all cards as quickfix for double render bug (real fix: clean up code and limit amount of renders by compartimentalizing)
                        board.current.map((card) => {
                            if (card.isTurned && card.inPlay){
                                card.isTurned = false;
                            }
                            return card;
                        });
                        card1.current = null;
                        card2.current = null;

                        let runEvent = considerEvent();
                        if (runEvent){
                            event.current.type = "event";
                            setRender(render + 1);
                        } else {
                            interactionAllowed.current = true;
                        }
                        setRender(render + 1);
                    }, 800);
                    return;
                }
            }
            setTimeout(() => {
                interactionAllowed.current = true;
                setRender(render + 1);
            }, 200);
        }
    }
    checkMemory();

    // ANIMATIONS
    const animationLength = 1500;
    const fadeLoader = useTransition((user === "isLoading"), {
        from: {opacity: 1},
        enter: {opacity: 1, duration: {animationLength}},
        leave: {opacity: 0, duration: {animationLength}},
    });
    const fadeMenu = useTransition((user === "isDeciding"), {
        from: {opacity: 0},
        enter: {opacity: 1, duration: {animationLength}},
        leave: {opacity: 0, duration: {animationLength}},
    });
    const fadeGame = useTransition((user === "isPlaying"), {
        from: {opacity: 0},
        enter: {opacity: 1, duration: {animationLength}},
    })
    const fadeInventory = useTransition((user === "isCollecting"), {
        from: {opacity: 0},
        enter: {opacity: 1, duration: {animationLength}},
        leave: {opacity: 0, duration: {animationLength}},
    });
    const fadeInfo = useTransition((user === "isReading"), {
        from: {scale: 0},
        enter: {scale: 1, duration: {animationLength}},
        leave: {scale: 0, duration: {animationLength}},
    });
    return(
        <div className="app">
            {fadeLoader((style, item) =>
                item 
                ?
                <animated.div style={style} className="container">
                    <LoaderWidget />
                </animated.div>
                :
                null
            )}
            {fadeMenu((style, item) =>
                item 
                ?
                <animated.div style={style} className="container">
                    <Menu clicker={setUser} gameProgress={gamestate.current} />
                </animated.div>
                :
                null
            )}
            {fadeGame((style, item) =>
                item 
                ?
                <animated.div style={style} className="container">
                    <ControlPanel 
                        time={starttime.current} 
                        state={gamestate.current}
                        stateChanger={setUser}

                    />
                    <Board 
                        deck={board.current} 
                        cardClicker={cardClicker} 
                        clickAllowed={interactionAllowed.current}
                        event={event.current}
                        exitEvent={exitEvent}
                        coords={clickPosition.current}
                        gameProgress={gamestate.current}
                        score={history.current}
                        eventCount={eventCounter.current}

                        stateChanger={setUser}
                        renderer={renderer}
                    />
                </animated.div>
                :
                null
            )}
            {fadeInventory((style, item) =>
                item 
                ?
                <animated.div style={style} className="container">
                    <Inventory 
                        deck={deck.current} 
                        events={events.current}
                        stateChanger={setUser} 
                        clearStorage={clearStorage} 
                    />
                </animated.div>
                :
                null
            )}
            {fadeInfo((style, item) =>
                item 
                ?
                <animated.div style={style} className="container">
                    <InfoScreen stateChanger={setUser}></InfoScreen>
                </animated.div>
                :
                null
            )}
        </div>
    );
}