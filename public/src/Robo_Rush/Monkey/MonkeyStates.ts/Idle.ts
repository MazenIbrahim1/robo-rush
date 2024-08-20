import { MonkeyStates, MonkeyAnimations } from "../MonkeyController";
import MonkeyState from "./MonkeyState";
import Input from "../../../Wolfie2D/Input/Input";
import { HW3Controls } from "../../HW3Controls";

export default class Idle extends MonkeyState {

	public onEnter(options: Record<string, any>): void {
        this.owner.animation.play(MonkeyAnimations.IDLE, true);
		this.parent.speed = this.parent.MIN_SPEED;
        this.parent.velocity.x = 0;
        this.parent.velocity.y = 0;
	}

	public update(deltaT: number): void {
		super.update(deltaT);
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}