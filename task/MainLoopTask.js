// task ==================================================================

class taskMainLoop extends GameTask {
    constructor(id){
        super(id);
    }
	
    state; 	elm_dbg;  scene;

    init(g){// task.add時に実行される。
		//asset(contents) load
        this.state = new stateControl(g);
		
        this.elm_dbg = document.getElementById("debug_cb");
        this.elm_dbg.checked = this.state.Config.debug;
    
        this.scene = new sceneControl(this.state);
    }
   
    pre = function (g) {
    }

    step = function (g) {
        this.scene.step();
    }

    draw = function (g) {
        this.scene.draw();
    }
}
