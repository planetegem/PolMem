import "../css/inspector.css";

export default function Inspector({card, returnHandler, coords}){
    // CONVERT COORDS TO RELATIVE PERCENTAGE ON SCREEN
    let xOffset = Math.floor((coords.x/window.innerWidth)*100),
        yOffset = Math.floor((coords.y/window.innerHeight)*100),
        origin = {transformOrigin: xOffset + "% " + yOffset + "%"};

    return(
        <div className="overlay" onClick={returnHandler}>
            <div className="inspector-container" style={origin}>
                <img src={card.src} alt={card.name}></img>
                <div className="inspector-details">
                    <div>
                        <h3>{card.name}</h3>
                        <br />
                        {card.affiliation
                        ?
                        <h4>{card.affiliation}</h4>
                        :
                        null
                        }
                    </div>
                    <p>{card.description}</p>
                    {card.effect
                    ?
                    <div className="event-effect">
                        <h4>effect:</h4>
                        <h4>{card.effect}</h4>
                    </div>
                    :
                    null
                    }
                    <div className="continue-inspector">
                        <span>-</span>
                        <span>click anywhere<br />to continue</span>
                        <span>-</span>
                    </div>
                </div>
            </div>
        </div>
    );
}