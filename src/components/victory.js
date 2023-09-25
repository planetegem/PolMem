import { animated, useTransition } from "@react-spring/web";

import { stringifyTime } from "../assets/helpers";
import { useState } from 'react';

import "../css/victory.css";

export default function Victory({ score, stateChanger, eventCount }){
    const [detailedView, setDetailedView] = useState(false);

    const openRecap = useTransition(detailedView, {
        from: {y: 2000},
        enter: {y: 0},
    });

    return(
        <>
        <div className="summary">
            <img src="images/pm_main.png" alt=""></img>
            <div className="summary-text">
                <h2>Congratulations!</h2> 
                <h3>You matched all politicians in just <span className="variable-score">{stringifyTime(score[score.length - 1][1]/1000)}</span>.</h3>
                <h3>While doing so, you encountered <span className="variable-score">{eventCount} random events</span>.</h3>
                <h3>Way to go!</h3>
            </div>
            <div className="summary-buttons">
                <button className="button" onClick={() => stateChanger("isDeciding")}>return to menu</button>
                <span>or</span>
                <button className="button" onClick={() => setDetailedView(true)}>view recap</button>
            </div>
        </div>
        {openRecap((style, item) =>
            item 
            ?
            <animated.div className="game-recap" style={style}>
            {score.map((card, index) => {
                return(
                    <div key={"score" + card[0].key + index}>
                    <div key={"score" + card[0].key + index} className={ (index % 2 !== 0) ? "score-card reversed" : "score-card" }>
                        <img src={card[0].src} alt={card[0].name}></img>
                        <div className="score-details">
                            <h3 className="score-header">
                                {(index + 1) + ". " + card[0].name + " "}
                                {card[0].affiliation ? "(" + card[0].affiliation + ") " : null}
                                {(card[0].affiliation ? "was eliminated after " : "triggered after ") + stringifyTime(card[1]/1000)}
                            </h3>
                            <p>{card[0].description}</p>
                            {card[0].effect 
                            ?
                            <div className="event-effect">
                                <h4>effect:</h4>
                                <h4>{card[0].effect}</h4>
                            </div>
                            :
                            null
                            }
                        </div>
                    </div>
                    {(index < score.length - 1) ? <hr className="divider" /> : null}
                    </div>
                );
            })}
            <button className="button" onClick={() => stateChanger("isDeciding")}>return to menu</button>
            </animated.div>
            :
            null
        )}
        </>
    )
}