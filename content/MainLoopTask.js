// task ==================================================================

class taskMainLoop extends GameTask {
    constructor(id){
        super(id);
    }
	
    state; 	scene;
    elm_dbg;  elm_lamp; elm_map;

    init(g){// task.add時に実行される。

        this.state = new stateControl(g);
	    this.scene = new sceneControl(this.state);

        g.state = this.state;
    }
   
    pre = function (g) {
        this.visible = false;
        this.enable = false;;
    }

    step = function (g) {

        let kstate = this.state.System.dev.key_state.check();
        let arrow = this.state.System.dev.directionM( kstate );
        let pstate = g.gamepad.check();

        const input = {
            up: arrow.up        // W 
            ,down: arrow.down   // S
            ,left: arrow.left   // A
            ,right: arrow.right // D
            ,trigger:{
                weapon:false
                ,useitem:false
                ,jump:false
                ,tgtlock:false
            }
            ,quit:false
            ,pause:false
            ,keycode: kstate
        }

        let zkey    = false;if (Boolean(kstate[90])) zkey      = kstate[90];//Z,(A)
        let spacekey= false;if (Boolean(kstate[32])) spacekey  = kstate[32];//SPACE
        input.trigger.weapon = (zkey || spacekey)?true:false;//Z, SPACE, (A)

        if (Boolean(kstate[88])) input.trigger.useitem  = kstate[88];//X, (X)
        if (Boolean(kstate[67])) input.trigger.jump     = kstate[67];//C, (B)
        if (Boolean(kstate[17])) input.trigger.tgtlock  = kstate[17];//Ctrl,[RB]

        if (Boolean(kstate[27])) input.pause    = kstate[27];//ESC, (START)
        if (Boolean(kstate[81])) input.quit     = kstate[81];//Q, (Y)

        this.scene.step(g, input);
    }

    draw = function (g) {
        this.scene.draw(g);
    }
}
