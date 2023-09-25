import { useState, useRef } from 'react';
import { animated, useTransition } from "@react-spring/web";
import { stringifyTime } from "../assets/helpers";

import Inspector from "./inspector";
import "../css/inventory.css";

export default function Inventory( { deck, events, stateChanger, clearStorage } ) {
    const [inspector, setInspector] = useState({active: false, card: null});
    const inspectorTransition = useTransition(inspector.active, {
        from: {opacity: 0},
        enter: {opacity: 1},
        leave: {opacity: 0, duration: 2000},
    });
    const coords = useRef({x: 0, y: 0});
    function inspectHandler(i){
        setInspector({active: true, card: inventory.current[i]});
    }
    function calculateStats(array){
        let counter = 0;
        for (let item of array){
            if (item.discovered){ counter++; }
        }
        return counter + "/" + array.length;
    }

    // Merge deck & inventory to
    let temp = [];
    deck.forEach(card => {
        temp.push(card);
        events.forEach(event => {
            if (event.politician === card.name){
                temp.push(event);
            }
        });
    });
    const inventory = useRef(temp);
    

    return(
        <div className="inventory-container">
            <header>
                <div className="stats-container">
                    <h1>statistics</h1>
                    <table className="stats">
                        <tbody>
                        <tr>
                            <td>cards found:</td>
                            <td>{calculateStats(deck)}</td>
                        </tr>
                        <tr>
                            <td>events triggered:</td>
                            <td>{calculateStats(events)}</td>
                        </tr>
                        <tr>
                            <td>times completed:</td>
                            <td>{localStorage.getItem("games")}</td>
                        </tr>
                        <tr>
                            <td>best time:</td>
                            <td>{stringifyTime(localStorage.getItem("bestTime"))}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div className="inventory-buttons">
                    <button className="button" onClick={() => stateChanger("isDeciding")}>return to menu</button>
                    <button className="button" onClick={() => clearStorage()}>reset progress</button>
                </div>
            </header>
            
            <div className="inventory">{
                inventory.current.map((card, index) => {
                    return(
                        <div className="inv-card-container" key={"inv" + card.key } >
                        {card.discovered
                        ?
                        <img 
                            onClick={(e) => {
                                coords.current = {x: e.clientX, y: e.clientY};
                                inspectHandler(index);
                            }} 
                            src={card.src}
                            alt={card.name}
                            className="clickable"                   
                        />
                        :
                        <img
                            key={"inv" + card.key }
                            src="images/card-hidden.svg"
                            alt="not found"
                            style={{opacity: 0.4}}
                        />
                        }
                        </div>
                    )
                })
            }
            </div>
            {inspectorTransition((style, item) =>
                item 
                ?
                <animated.div style={style} className="overlay">
                    <Inspector card={inspector.card} returnHandler={() => setInspector({active: false, card: inspector.card})} coords={coords.current} />
                </animated.div>
                :
                null
            )}
        </div>
    )
}
