import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";
import { HW3Events } from "../../HW3Events";
import { PlayerAnimations, PlayerTweens } from "../PlayerController";
import PlayerState from "./PlayerState";

export default class Dead extends PlayerState {

    // Trigger the player's death animation when we enter the dead state
    public onEnter(options: Record<string, any>): void {
        let scene = this.owner.getScene()
        this.emitter.fireEvent(GameEventType.PLAY_MUSIC, {key: scene.getDeadAudioKey(), loop: false, holdReference: false})
        this.owner.animation.playIfNotAlready(PlayerAnimations.DYING, false, HW3Events.PLAYER_DEAD);
    }

    // Ignore all events from the rest of the game
    public handleInput(event: GameEvent): void { }

    // Empty update method - if the player is dead, don't update anything
    public update(deltaT: number): void {}

    public onExit(): Record<string, any> { return {}; }
    
}