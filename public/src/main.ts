import Game from "./Wolfie2D/Loop/Game";
import MainMenu from "./Robo_Rush/Scenes/MainMenu";
import { HW3Controls } from "./Robo_Rush/HW3Controls";
import SplashScreen from "./Robo_Rush/Scenes/SplashScreen";

(function main(){
    let options = {
        canvasSize: {x: 1200, y: 800},          
        clearColor: {r: 34, g: 32, b: 52},   
        inputs: [
            {name: HW3Controls.JUMP, keys: ["space"]},
            {name: HW3Controls.MOVE_DOWN, keys: ["s"]},
            {name: HW3Controls.MOVE_UP, keys: ["w"]},
            {name: HW3Controls.ESC, keys: ["escape"]},
            {name: HW3Controls.CHEAT1, keys: ["1"]},
            {name: HW3Controls.CHEAT2, keys: ["2"]},
            {name: HW3Controls.CHEAT3, keys: ["3"]},
            {name: HW3Controls.CHEAT4, keys: ["4"]},
            {name: HW3Controls.CHEAT5, keys: ["5"]},
            {name: HW3Controls.CHEAT6, keys: ["6"]},
        ],
        useWebGL: false,                        
        showDebug: false                       
    }

    const game = new Game(options);
    game.start(SplashScreen, {});
})();