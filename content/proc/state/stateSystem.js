//stateSystem
//デバイスパラメータやサウンド状況等
function stateSystem(g) {

    this.dev = new deviceControl(g);
    this.deltaTime = g.deltaTime;
    this.time = g.time;
    this.blink = g.blink;

    //this.obCtrlControl = new gObjectControl(work, state);
    //this.mapSceControl = new mapSceControl();
}
