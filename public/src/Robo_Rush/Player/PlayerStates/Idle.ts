import { PlayerStates, PlayerAnimations } from "../PlayerController";
import PlayerState from "./PlayerState";
import Input from "../../../Wolfie2D/Input/Input";
import { HW3Controls } from "../../HW3Controls";

export default class Idle extends PlayerState {
    static djAvailable: boolean;

	public onEnter(options: Record<string, any>): void {
        this.owner.animation.play(PlayerAnimations.IDLE);
		this.parent.speed = this.parent.MIN_SPEED;

        this.parent.velocity.x = 200; 
        this.parent.velocity.y = 0;
	}

	public update(deltaT: number): void {
        //Sets double jump to true
        Idle.djAvailable = true;

        // If the player is jumping, transition to the jumping state
        if (Input.isJustPressed(HW3Controls.JUMP)) {
            this.finished(PlayerStates.JUMP);
        }
        // If the player is not on the ground, transition to the falling state
        else if (!this.owner.onGround && this.parent.velocity.y > 0) {
            this.finished(PlayerStates.FALL);
        } else {
            // Update the vertical velocity of the player
            this.parent.velocity.y += this.gravity*deltaT;
            // Move the player
            this.owner.move(this.parent.velocity.scaled(deltaT));
        }

        // Otherwise, do nothing (keep idling)
		
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}