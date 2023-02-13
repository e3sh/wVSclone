// task ==================================================================

class taskMainLoop extends GameTask {
    constructor(id){
        super(id);
    }
	
    state; 	scene;
    elm_dbg;  elm_lamp; elm_map;

    init(g){// task.add時に実行される。
		//asset(contents) load
        this.state = new stateControl(g);
		
        this.elm_divcnsl = document.getElementById("console");

        this.elm_dbg = document.getElementById("debug_cb");
        this.elm_lamp = document.getElementById("lamp_cb");
        this.elm_map = document.getElementById("mapview_cb");
    
        this.scene = new sceneControl(this.state);

        g.state = this.state;
    }
   
    pre = function (g) {
        this.elm_dbg.checked = this.state.Config.debug;
        this.elm_lamp.checked = this.state.Config.lamp_use; 
        this.elm_map.checked = this.state.Config.map_use;
        this.elm_dbg.checked = this.state.Config.debug; 

        //this.state.Config.debug = this.elm_dbg.checked;
        //this.state.Config.lamp_use = this.elm_lamp.checked; 
        //this.state.Config.map_use = this.elm_map.checked;

        //pause task
        this.visible = false;
        this.enable = false;;
    }

    step = function (g) {
        if (this.elm_dbg.checked != this.state.Config.debug) {
            this.state.Config.debug = this.elm_dbg.checked ; 
            //this.elm_divcnsl.style.visibility =  (this.elm_dbg.checked ) ? 'visible' : 'hidden';
        };
        if (this.elm_lamp.checked != this.state.Config.lamp_use){ 
            this.state.Config.lamp_use = this.elm_lamp.checked; 
        };
        
        if (this.elm_map.checked != this.state.Config.map_use){ 
            this.state.Config.map_use = this.elm_map.checked; 
        }
        this.scene.step();

    }

    draw = function (g) {
        this.scene.draw();
    }
}
