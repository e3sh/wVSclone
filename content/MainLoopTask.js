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
        this.scene.step();
    }

    draw = function (g) {
        this.scene.draw();
    }
}
