import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import HW3Level, { HW3Layers } from "./Level";
import MainMenu from "./MainMenu";

import Viewport from "../../Wolfie2D/SceneGraph/Viewport";
import RenderingManager from "../../Wolfie2D/Rendering/RenderingManager";
import SceneManager from "../../Wolfie2D/Scene/SceneManager";
import Level1 from "./Level1";
import Level4 from "./Level4";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { HW3Events } from "../HW3Events";
import { HW3PhysicsGroups } from "../HW3PhysicsGroups";
import MonkeyController from "../Monkey/MonkeyController";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import HW3Level4 from "./Level4";


export default class Level3 extends HW3Level {

    protected monkeySpriteKey: string;
    protected monkey: AnimatedSprite;
    protected monkey0: Vec2;
    protected monkey1: Vec2;
    protected monkey2: Vec2;
    protected monkey3: Vec2;
    protected monkey4: Vec2;
    protected monkey5: Vec2;
    protected monkey6: Vec2;
    protected monkey7: Vec2;
    protected monkey8: Vec2;
    protected monkey9: Vec2;
    protected monkey10: Vec2;
    protected monkey11: Vec2;
    protected monkey12: Vec2;
    protected monkey13: Vec2;
    protected monkey14: Vec2;
    protected monkey15: Vec2;
    protected monkey16: Vec2;
    protected monkey17: Vec2;

    public static readonly PLAYER_SPAWN = new Vec2(32, 300);
    public static readonly PLAYER_SPRITE_KEY = "PLAYER_SPRITE_KEY";
    public static readonly PLAYER_SPRITE_PATH = "assets/spritesheets/Pakma.json";

    public static readonly MONKEY_SPRITE_KEY = "MONKEY_SPRITE_KEY";
    public static readonly MONKEY_SPRITE_PATH = "assets/spritesheets/MonkeyMinion.json";

    public static readonly MONKEY_SPAWN0 = new Vec2(600, 385);
    public static readonly MONKEY_SPAWN1 = new Vec2(900, 385);
    public static readonly MONKEY_SPAWN2 = new Vec2(1300, 385);
    public static readonly MONKEY_SPAWN3 = new Vec2(4000, 385);
    public static readonly MONKEY_SPAWN4 = new Vec2(4500, 385);
    public static readonly MONKEY_SPAWN5 = new Vec2(4600, 385);
    public static readonly MONKEY_SPAWN6 = new Vec2(5700, 385);
    public static readonly MONKEY_SPAWN7 = new Vec2(5700, 335);
    public static readonly MONKEY_SPAWN8 = new Vec2(6900, 335);
    public static readonly MONKEY_SPAWN9 = new Vec2(6900, 385);
    public static readonly MONKEY_SPAWN10 = new Vec2(2500, 385);
    public static readonly MONKEY_SPAWN11 = new Vec2(6900, 285);
    public static readonly MONKEY_SPAWN12 = new Vec2(6900, 235);
    

    public static readonly BACKGROUND_KEY = "BACKGROUND_KEY";
    public static readonly BACKGROUND_PATH = "assets/images/Screenshot 2023-04-24 002502.png";

    public static readonly TILEMAP_KEY = "LEVEL1";
    public static readonly TILEMAP_PATH = "assets/tilemaps/level3final.json";
    public static readonly TILEMAP_SCALE = new Vec2(1, 1);
    public static readonly DESTRUCTIBLE_LAYER_KEY = "Destructable";
    public static readonly WALLS_LAYER_KEY = "Main";
    public static readonly BACKGROUND_LAYER_KEY = "Background";

    public static readonly LEVEL_MUSIC_KEY = "LEVEL_MUSIC";
    public static readonly LEVEL_MUSIC_PATH = "assets/music/jungleLevelMusic.mp3";

    public static readonly JUMP_AUDIO_KEY = "PLAYER_JUMP";
    public static readonly JUMP_AUDIO_PATH = "assets/sounds/jump.wav";

    public static readonly DEAD_AUDIO_KEY = "PLAYER_DEATH";
    public static readonly DEAD_AUDIO_PATH = "assets/sounds/player_death.wav";

    public static readonly TAKING_DAMAGE_AUDIO_KEY = "PLAYER_JUMP";
    public static readonly TAKING_DAMAGE_AUDIO_PATH = "assets/sounds/taking_damage.mp3";

    public static readonly LEVEL_END = new AABB(new Vec2(224, 232), new Vec2(24, 16));

    public constructor(viewport: Viewport, sceneManager: SceneManager, renderingManager: RenderingManager, options: Record<string, any>) {
        super(viewport, sceneManager, renderingManager, options);

        // Set the keys for the different layers of the tilemap
        this.tilemapKey = Level3.TILEMAP_KEY;
        this.backgroundKey = Level3.BACKGROUND_KEY;
        this.tilemapScale = Level3.TILEMAP_SCALE;
        this.destructibleLayerKey = Level3.DESTRUCTIBLE_LAYER_KEY;
        this.wallsLayerKey = Level3.WALLS_LAYER_KEY;
        this.backgroundLayerKey = Level3.BACKGROUND_LAYER_KEY;

        // Set the key for the player's sprite
        this.playerSpriteKey = Level3.PLAYER_SPRITE_KEY;
        // Set the player's spawn
        this.playerSpawn = Level3.PLAYER_SPAWN;

        this.onRope1 = new Vec2(7800, 385);
        this.onRope2 = new Vec2(15000, 385);

        this.monkeySpriteKey = Level3.MONKEY_SPRITE_KEY;
        this.monkey0 = Level3.MONKEY_SPAWN0;
        this.monkey1 = Level3.MONKEY_SPAWN1;
        this.monkey2 = Level3.MONKEY_SPAWN2;
        this.monkey3 = Level3.MONKEY_SPAWN3;
        this.monkey4 = Level3.MONKEY_SPAWN4;
        this.monkey5 = Level3.MONKEY_SPAWN5;
        this.monkey6 = Level3.MONKEY_SPAWN6;
        this.monkey7 = Level3.MONKEY_SPAWN7;
        this.monkey8 = Level3.MONKEY_SPAWN8;
        this.monkey9 = Level3.MONKEY_SPAWN9;
        this.monkey10 = Level3.MONKEY_SPAWN10;
        this.monkey11 = Level3.MONKEY_SPAWN11;
        this.monkey12 = Level3.MONKEY_SPAWN12;


        // Music and sound
        this.levelMusicKey = Level1.LEVEL_MUSIC_KEY
        this.jumpAudioKey = Level1.JUMP_AUDIO_KEY;
        this.deadAudioKey = Level1.DEAD_AUDIO_KEY;
        this.takingDamageAudioKey = Level1.TAKING_DAMAGE_AUDIO_KEY;

        // Level end size and position
        this.levelEndPosition = new Vec2(15750, 400).mult(this.tilemapScale);
        this.levelEndHalfSize = new Vec2(500, 500).mult(this.tilemapScale);
    }

    /**
     * Load in our resources for level 1
     */
    public loadScene(): void {
        // Load in the tilemap
        this.load.tilemap(this.tilemapKey, Level3.TILEMAP_PATH);
        this.load.image(this.backgroundKey, Level3.BACKGROUND_PATH);
        // Load in the player's sprite
        this.load.spritesheet(this.playerSpriteKey, Level3.PLAYER_SPRITE_PATH);
        this.load.spritesheet(this.monkeySpriteKey, Level3.MONKEY_SPRITE_PATH);
        // Audio and music
        this.load.audio(this.levelMusicKey, Level1.LEVEL_MUSIC_PATH);
        this.load.audio(this.jumpAudioKey, Level1.JUMP_AUDIO_PATH);
        this.load.audio(this.deadAudioKey, Level1.DEAD_AUDIO_PATH);
        this.load.audio(this.takingDamageAudioKey, Level1.TAKING_DAMAGE_AUDIO_PATH);
    }

    /**
     * Unload resources for level 1 - decide what to keep
     */
    public unloadScene(): void {
        super.unloadScene();
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: Level1.LEVEL_MUSIC_KEY});
        this.load.keepSpritesheet(this.monkeySpriteKey);
        this.load.keepSpritesheet(this.playerSpriteKey);
        this.load.keepImage(this.backgroundKey);
        this.load.keepAudio(this.levelMusicKey);
        this.load.keepAudio(this.jumpAudioKey);
        this.load.keepAudio(this.deadAudioKey);
        this.load.keepAudio(this.takingDamageAudioKey);
    }

    public startScene(): void {
        super.startScene();
        // Set the next level to be Level2
        this.nextLevel = HW3Level4;

        this.initializeMonkey(this.monkeySpriteKey, this.monkey0);
        this.initializeMonkey(this.monkeySpriteKey, this.monkey1);
        this.initializeMonkey(this.monkeySpriteKey, this.monkey2);
        this.initializeMonkey(this.monkeySpriteKey, this.monkey3);
        this.initializeMonkey(this.monkeySpriteKey, this.monkey4);
        this.initializeMonkey(this.monkeySpriteKey, this.monkey5);
        this.initializeMonkey(this.monkeySpriteKey, this.monkey6);
        this.initializeMonkey(this.monkeySpriteKey, this.monkey7);
        this.initializeMonkey(this.monkeySpriteKey, this.monkey8);
        this.initializeMonkey(this.monkeySpriteKey, this.monkey9);
        this.initializeMonkey(this.monkeySpriteKey, this.monkey10);
        this.initializeMonkey(this.monkeySpriteKey, this.monkey11);
        this.initializeMonkey(this.monkeySpriteKey, this.monkey12);
    }

    protected initializeMonkey(key: string, spawn: Vec2): void {
        // Add the player to the scene
        this.monkey = this.add.animatedSprite(this.monkeySpriteKey, HW3Layers.PRIMARY);
        this.monkey.scale.set(2,2);
        this.monkey.position.copy(spawn);
        
        // Give the player physics and setup collision groups and triggers for the player
   
        this.monkey.addPhysics(new AABB(this.monkey.position.clone(), this.monkey.boundary.getHalfSize().clone()));
        this.monkey.setGroup(HW3PhysicsGroups.MONKEY);
        this.monkey.setTrigger(HW3PhysicsGroups.PLAYER, HW3Events.PLAYER_MONKEY_COLLISION, null);

        // // Give the player it's AI
        this.monkey.addAI(MonkeyController, { player: this.player, tilemap: "Primary"});
    }

    protected initializeViewport(): void {
        super.initializeViewport();
        
    }

}