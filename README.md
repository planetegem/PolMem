This new version of Political Memory was made as an excuse to test ReactJS.

Gameplay:
As before, the objective of the game is to eliminate politicians from the Belgian political landscape by matching them together in a game of memory. Added to this is a system of random events: everytime you incorrectly match a politician, a dice roll is done to determine if a random event can fire. Every event has its own probability and conditions of firing (i.e. is a politician in game? Has a politician been revealed? Has a politician been Eliminated?).

Execution:
- The main app.js component keeps track of arrays containing events, cards & memory slots.
- Card descriptions and event rules are stored in seperate files (under assets): these are loaded into the main app component.
- Data from the app component is drilled to the board component. This component then generates cards on the screen. This is also where the eventbuilder component lives.
- All interaction is handled through the clickhandler method in the app component.
- Game progress is saved in localStorage

Conclusion:
I'm not entirely happy with how this game turned out, but it was a valuable in experience to get to know ReactJS. There are still some bugs and the game is running far from efficiently, but it runs anyway. The game needs some serious refactoring: there are just to many variables running around. I should also have made more use of objects kept in memory to localize data. However, I'm not inclined to continue working on this project: I can see ReactJS being useful to create simple websites or webapplications, but it's just too unwieldy for use in webgames. It becomes a constant struggle to check which component has which data exactly, as they aren't always updated at the same time.

