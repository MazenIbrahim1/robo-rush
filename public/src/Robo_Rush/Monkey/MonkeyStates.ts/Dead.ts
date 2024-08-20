import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { HW3Events } from "../../HW3Events";
import { MonkeyAnimations } from "../MonkeyController";
import MonkeyStates from "./MonkeyState";


export default class Dead extends MonkeyStates {

    // Trigger the player's death animation when we enter the dead state
    public onEnter(options: Record<string, any>): void {
        this.owner.animation.playIfNotAlready(MonkeyAnimations.DEAD);
    }

    // Ignore all events from the rest of the game
    public handleInput(event: GameEvent): void { }

    // Empty update method - if the player is dead, don't update anything
    public update(deltaT: number): void {}

    public onExit(): Record<string, any> {
		//this.owner.animation.stop();
		return {};
	}    
}