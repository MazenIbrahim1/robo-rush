import { PlayerStates, PlayerAnimations } from "../PlayerController";
import PlayerState from "./PlayerState";
import Input from "../../../Wolfie2D/Input/Input";
import { Robo_RushControls } from "../../controls";

export default class Idle extends PlayerState {

	public onEnter(options: Record<string, any>): void {
        this.owner.animation.play(PlayerAnimations.RUNNING);
		//this.parent.speed = this.parent.MIN_SPEED;

        this.parent.velocity.x = 0;
        this.parent.velocity.y = 0;
	}

	public update(deltaT: number): void {

        // If the player is jumping, transition to the jumping state
        if (Input.isJustPressed(Robo_RushControls.JUMP)) {
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

        // Otherwise, do nothing (keep running)
		
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}