import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";
import Input from "../../../Wolfie2D/Input/Input";
import { PlayerAnimations, PlayerStates, PlayerTweens } from "../PlayerController";
import { HW3Controls } from "../../HW3Controls";
import PlayerState from "./PlayerState";
import Idle from "./Idle";

export default class Jump extends PlayerState {

	public onEnter(options: Record<string, any>): void {
        this.owner.animation.play(PlayerAnimations.JUMP);
        let scene = this.owner.getScene()
        
        // Give the player a burst of upward momentum
        this.parent.velocity.y = -350;

        // Play the jump sound for the player
		this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: scene.getJumpAudioKey(), loop: false, holdReference: false});
	}

	public update(deltaT: number): void {
        // If the player hit the ground, start idling
        if (this.owner.onGround) {
			this.finished(PlayerStates.IDLE);
		} 
        // Checks if the player presses jump
        else if (Input.isJustPressed(HW3Controls.JUMP) && Idle.djAvailable == true) {
            Idle.djAvailable = false;
            this.finished(PlayerStates.DOUBLE_JUMP);
        }
        // If the player hit the ceiling or their velocity is >= to zero, 
        else if(this.owner.onCeiling || this.parent.velocity.y >= 0){
            this.finished(PlayerStates.FALL);
		}
        // Otherwise move the player
        else {
            this.parent.velocity.y += this.gravity*deltaT;
            // Move the player
            this.owner.move(this.parent.velocity.scaled(deltaT));
        }
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}