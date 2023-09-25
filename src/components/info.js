import "../css/info.css";

export default function InfoScreen({ stateChanger }) {
    return (
        <div className="info-screen">
            <img src="images/eb-logo.svg" alt="Encyclopaedia Belgica"></img>
            <h3>
                "Every Politician is a two-faced piece of human trash," says a famous Belgian proverb.
                Match the many faces of politicians in this exciting game of Political Memory!
            </h3>
            <ul>
                <li>See more of my work? Visit <a href="https://www.planetegem.be" target="_blank" rel="noreferrer">www.planetegem.be</a>.</li>
                <li>Want to receive updates? Help me become an influencer and follow me on <a href="https://www.instagram.com/planetegem/" target="_blank" rel="noreferrer">instagram</a>.</li>
            </ul>
            <div className="legal">
                <h4>privacy & copright</h4>
                <p>
                    Political Memory does not have any commercial purpose. While content is dramatized for comedic effect, the only purpose of this game is eductional and spreading a bit of Belgian culture.
                    As such, this project does not generate any profit for its creator. Any image depicting Belgian politicians is used to mock the politicians in question and nothing more.
                    If you own copyright to one of these images and disagree with their being used here, please contact me at info@planetegem.be to have them removed.
                </p>
                <p>
                    Game progress is saved in your browser's localStorage.
                    The game does not retain any info which can be used to track your personal preferences, be it for advertising, commercial or analytic reasons.
                </p>
            </div>
            <button onClick={() => stateChanger("isDeciding")}>
                <span>RETURN TO MENU</span>
            </button>
        </div>
    );
}