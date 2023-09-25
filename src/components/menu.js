import "../css/menu.css";

export default function Menu({ clicker, progress }){
    return(
        <>
        <div className="main-menu">
            <img src="images/pm_main.png" alt="brainpower"></img>
            <div className="menu-buttons">
                <button onClick={() => clicker("isPlaying")}>
                    <img src="images/arrow.svg" alt="" className="arrow"></img>
                    <span className="button-name">{(progress === "started" || progress === "paused") ? "continue" : "start game"}</span>
                    <img src="images/arrow.svg" alt="" className="arrow"></img>
                </button>
                <button onClick={() => clicker("isCollecting")}>
                    <img src="images/arrow.svg" alt="" className="arrow"></img>
                    <span className="button-name">inventory</span>
                    <img src="images/arrow.svg" alt="" className="arrow"></img>
                </button>
            </div>
            <button onClick={() => clicker("isReading")} className="info-button">i</button>
            <footer>&#169; 2023 Niels Van Damme | www.planetegem.be</footer>
        </div>
        </>
    );
}