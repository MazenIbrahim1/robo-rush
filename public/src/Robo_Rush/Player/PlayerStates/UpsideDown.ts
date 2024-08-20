import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";
import Input from "../../../Wolfie2D/Input/Input";
import { PlayerAnimations, PlayerStates, PlayerTweens } from "../PlayerController";
import { HW3Controls } from "../../HW3Controls";
import PlayerState from "./PlayerState";
import Idle from "./Idle";
import { HW3Events } from "../../HW3Events";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";

export default class UpsideDown extends PlayerState {

	public onEnter(options: Record<string, any>): void {
        this.owner.animation.play(PlayerAnimations.UPSIDE_DOWN);
        let scene = this.owner.getScene()
        this.owner.position.y = 490;
        this.parent.velocity.x = 200; 
        this.gravity = 0;
    }

	public update(deltaT: number): void {
        // Checks if the player presses jump
        if (Input.isJustPressed(HW3Controls.MOVE_UP)) {
            this.emitter.fireEvent(HW3Events.MOVE_UP);
            this.owner.animation.play(PlayerAnimations.IDLE);
            this.owner.position.y = 374;
            this.gravity = 0;
        }
        // Otherwise move the player
        else {
            this.parent.velocity.x = 200;
            // Move the player
            this.owner.move(new Vec2(3,0));
        }
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}