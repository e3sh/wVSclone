/**
 * @file This file provides a 2D collision detection utility based on a linear quadtree.
 *       It includes a polyfill for Object.prototype.__defineGetter__ and __defineSetter__
 *       to ensure compatibility with older JavaScript environments where these methods
 *       might be absent, ensuring the proper functioning of object properties like `objectNum`.
 */
try {
   if (!Object.prototype.__defineGetter__ && Object.defineProperty({},"x",{get: function(){return true}}).x) {
	  Object.defineProperty(Object.prototype, "__defineGetter__",
		 {enumerable: false, configurable: true,
		  value: function(name,func)
			 {Object.defineProperty(this,name,
				 {get:func,enumerable: true,configurable: true});
	  }});
	  Object.defineProperty(Object.prototype, "__defineSetter__",
		 {enumerable: false, configurable: true,
		  value: function(name,func)
			 {Object.defineProperty(this,name,
				 {set:func,enumerable: true,configurable: true});
	  }});
   }
} catch(defPropException) {/*Do nothing if an exception occurs*/};
/**
 * CLinear4TreeManager は、2次元空間におけるオブジェクトの衝突判定を効率的に行うための線形四分木（Linear Quadtree）マネージャーです。
 * このユーティリティは、広大なゲームマップや多数のオブジェクトが存在する環境において、
 * すべてのオブジェクトペアに対して直接衝突判定を行うよりも、大幅にパフォーマンスを向上させることができます。
 *
 * @description
 * 四分木は、空間を再帰的に四分割していくデータ構造であり、オブジェクトが存在する領域のみを細かく分割することで、
 * 衝突の可能性のあるオブジェクトの検索範囲を限定します。
 * CLinear4TreeManager は、その四分木を線形配列として管理することで、メモリ効率とアクセス速度を最適化しています。
 *
 * 衝突判定のアルゴリズムについては、以下のリソースを参考にしています:
 * 
 * ユーティリティは、オブジェクトのバウンディングボックスに基づいてモートン数 (Morton Number) を計算し、
 * それを元にオブジェクトを適切なツリーセルに登録します。
 * その後、`getAllCollisionList()` メソッドを呼び出すことで、衝突の可能性のあるオブジェクトのペアのリストを取得できます。
 *
 * @see http://marupeke296.com/COL_2D_No8_QuadTree.html
 * @see http://marupeke296.com/COLSmp_2D_No9_QuadTree_Imp.html
 * @example
 * // CLinear4TreeManager の基本的な使用例
 *
 * // 1. マネージャーのインスタンスを作成します
 * const manager = new CLinear4TreeManager();
 *
 * // 2. マネージャーを初期化します
 * //    level: 四分木の深さ (9未満)。値が大きいほど精度が高まりますが、処理負荷も増えます。
 * //    left, top, right, bottom: 衝突判定を行う空間の境界座標。
 * //    この例では、幅1024、高さ768の領域をレベル5で管理します。
 * manager.init(5, 0, 0, 1024, 768); //
 *
 * // 3. 衝突判定の対象となるオブジェクトを準備します
 * //    ここでは、仮想的なゲームオブジェクトを想定します。
 * const player = { id: 'player', x: 100, y: 100, width: 32, height: 32 };
 * const enemy1 = { id: 'enemy1', x: 120, y: 110, width: 24, height: 24 };
 * const enemy2 = { id: 'enemy2', x: 500, y: 300, width: 48, height: 48 };
 *
 * // 4. 各ゲームオブジェクトに対して OBJECT_FOR_TREE ラッパーを作成し、マネージャーに登録します
 * //    OBJECT_FOR_TREE は、ツリー内での管理に必要なプロパティを持ちます。
 * //    登録する実際のゲームオブジェクトは、oft.obj プロパティに格納すると便利です (内部の衝突リストで参照されます)。
 * const oftPlayer = manager.createObjectForTree(player.id); //
 * oftPlayer.obj = player;
 * manager.register(player.x, player.y, player.x + player.width, player.y + player.height, oftPlayer); //
 *
 * const oftEnemy1 = manager.createObjectForTree(enemy1.id);
 * oftEnemy1.obj = enemy1;
 * manager.register(enemy1.x, enemy1.y, enemy1.x + enemy1.width, enemy1.y + enemy1.height, oftEnemy1);
 *
 * const oftEnemy2 = manager.createObjectForTree(enemy2.id);
 * oftEnemy2.obj = enemy2;
 * manager.register(enemy2.x, enemy2.y, enemy2.x + enemy2.width, enemy2.y + enemy2.height, oftEnemy2);
 *
 * // 5. 全てのオブジェクトの登録が完了した後、衝突リストを取得します
 * //    このリストには、衝突している可能性のあるオブジェクトのペアが含まれます。
 * //    (注意: このメソッドが呼び出されると、マネージャー内の内部衝突リストはリセットされます)
 * const collisionCandidates = manager.getAllCollisionList(); //
 *
 * // 6. 衝突リストを処理し、詳細な衝突判定を行います
 * if (collisionCandidates) {
 *   // collisionCandidates は配列として実装されており、2つおきにペアが格納されています
 *   for (let i = 0; i < collisionCandidates.length; i += 2) {
 *     const objA = collisionCandidates[i];   // 最初のオブジェクト
 *     const objB = collisionCandidates[i+1]; // 2番目のオブジェクト
 *
 *     console.log(`衝突候補ペア: ${objA.id} と ${objB.id}`); //
 *
 *     // ここで実際の矩形衝突判定（AABBチェックなど）や、より複雑な判定ロジックを実装します。
 *     // 例: AABB (Axis-Aligned Bounding Box) 衝突判定
 *     if (objA.x < objB.x + objB.width &&
 *         objA.x + objA.width > objB.x &&
 *         objA.y < objB.y + objB.height &&
 *         objA.y + objA.height > objB.y) {
 *         console.log(`実際に衝突しました: ${objA.id} と ${objB.id}`);
 *         // 衝突後の処理（ダメージを与える、エフェクトを再生するなど）
 *     }
 *   }
 * }
 */
function CLinear4TreeManager() {
    // private members
    let objectNum = 0;

    // public members
    this.level = 0;
    this.w = 0;
    this.h = 0;
    this.l = 0;
    this.t = 0;
    this.unitW = 0;
    this.unitH = 0;
    this.cellNum = 0;
    this.cellAry = null;
    this.dim = 0;
    this.colList = new CollisionList();

    this.pow = new Array(9 + 1);
    this.pow[0] = 1;
    for (let i = 1; i < 9 + 1; i++) {
        this.pow[i] = this.pow[i - 1] * 4;
    }

    // cell item wrapper class
    function OBJECT_FOR_TREE(id) {
        this.id = id || 0;
        this.cell = this.obj = this.pre = this.next = null;
    }
    OBJECT_FOR_TREE.prototype.remove = function () {
        if (!this.cell || !this.cell.onRemove(this)) return false;
        this.pre && (this.pre.next = this.next);
        this.next && (this.next.pre = this.pre);
        this.pre = this.next = this.cell = null;
        return true;
    };

    // cell class
    function CCell() {
        this.latest = null;
    }
    CCell.prototype.push = function (oft) {
        if (!oft) return false;
        if (oft.cell == this) return false;
        if (!this.latest) {
            this.latest = oft;
        }
        else {
            oft.next = this.latest;
            this.latest.pre = oft;
            this.latest = oft;
        }
        oft.cell = this;
        objectNum++;
        return true;
    };
    CCell.prototype.getFirstObj = function () {
        return this.latest;
    };
    CCell.prototype.onRemove = function (oft) {
        if (this.latest == oft) {
            if (this.latest) {
                this.latest = this.latest.next;
            }
        }
        objectNum--;
        return true;
    };

    // collision list class
    function CollisionList() {
        let result = new Array();
        result.wright = function (obj1, obj2) {
            //if (obj1.type != obj2.type){
			//	obj1.visible && obj2.visible){
            //if (obj1.collisionType != obj2.collisionType &&
			//		obj1.visible && obj2.visible &&
			//		obj1.age == 1 && obj2.age == 1) {
                this.push(obj1);
                this.push(obj2);
            //}
        };
        return result;
    }

    // private functions
    function getCollisionList(elem, colStack) {
        let oft1 = this.cellAry[elem].getFirstObj();

        // 1
        while (oft1) {
            let oft2 = oft1.next;
            while (oft2) {
                this.colList.wright(oft1.obj, oft2.obj);
                oft2 = oft2.next;
            }
            // 2
            for (let i = 0, goal = colStack.length; i < goal; i++) {
                this.colList.wright(oft1.obj, colStack[i]);
            }
            oft1 = oft1.next;
        }

        // 3
        let childFlag = false;
        let objNum = 0;
        for (let i = 0; i < 4; i++) {
            let nextElem = elem * 4 + 1 + i;
            if (nextElem < this.cellNum && this.cellAry[nextElem]) {
                if (!childFlag) {
                    // 4
                    oft1 = this.cellAry[elem].getFirstObj();
                    while (oft1) {
                        colStack.push(oft1.obj);
                        objNum++;
                        oft1 = oft1.next;
                    }
                }
                childFlag = true;
                arguments.callee.call(this, nextElem, colStack);
            }
        }

        // 5
        if (childFlag) {
            for (let i = 0; i < objNum; i++) {
                colStack.pop();
            }
        }

        return true;
    }

    function createNewCell(elem) {
        while (!this.cellAry[elem]) {
            this.cellAry[elem] = new CCell();
            elem = (elem - 1) >> 2;
            if (elem < 0 || elem >= this.cellNum) {
                break;
            }
        }
        return true;
    }

    function getMortonNumber(left, top, right, bottom) {
        let rightEdge = this.l + this.w - 1;
        let bottomEdge = this.t + this.h - 1;

        if (left > rightEdge || right < this.l || top > bottomEdge || bottom < this.t) { return 0x7fffffff; }
        if (left < this.l) { left = this.l; }
        if (right > rightEdge) { right = rightEdge; }
        if (top < this.t) { top = this.t; }
        if (bottom > bottomEdge) { bottom = bottomEdge; }

        let LT = getPointElem.call(this, left, top);
        let RB = getPointElem.call(this, right, bottom);

        let def = RB ^ LT;
        let hiLevel = 0;
        for (let i = 0; i < this.level; i++) {
            let check = (def >> (i * 2)) & 0x3;

            if (check != 0) {
                hiLevel = i + 1;
            }
        }
        let spaceNum = RB >> (hiLevel * 2);
        let addNum = (this.pow[this.level - hiLevel] - 1) / 3;
        spaceNum += addNum;
        if (spaceNum > this.cellNum) {
            return 0x7fffffff;
        }
        return spaceNum;
    }

    function bitSeparate32(n) {
        n = (n | (n << 8)) & 0x00ff00ff;
        n = (n | (n << 4)) & 0x0f0f0f0f;
        n = (n | (n << 2)) & 0x33333333;
        return (n | (n << 1)) & 0x55555555;
    }

    function get2DMortonNumber(x, y) {
        return bitSeparate32(x) | (bitSeparate32(y) << 1);
    }

    function getPointElem(pos_x, pos_y) {
        return get2DMortonNumber(
				parseInt((pos_x - this.l) / this.unitW),
				parseInt((pos_y - this.t) / this.unitH));
    }

    // public functions
    this.init = function (level, left, top, right, bottom) {
        if (level >= 9) {
            return false;
        }

        this.cellNum = (this.pow[level + 1] - 1) / 3;
        this.cellAry = new Array(this.cellNum);

        this.l = left;
        this.t = top;
        this.w = right - left;
        this.h = bottom - top;
        this.unitW = this.w / (1 << level);
        this.unitH = this.h / (1 << level);
        this.level = level;

        return true;
    };

    this.register = function (left, top, right, bottom, oft) {
        let elem = getMortonNumber.call(this, left, top, right, bottom);
        if (elem < this.cellNum) {
            !this.cellAry[elem] && createNewCell.call(this, elem);
            return this.cellAry[elem].push(oft);
        }
        return false;
    };

    this.getAllCollisionList = function () {
        let result = false;
        if (this.cellAry[0]) {
            let colStack = [];
            getCollisionList.call(this, 0, colStack);
            result = this.colList;
            this.colList = new CollisionList();
        }
        return result;
    };

    this.createObjectForTree = function (id) {
        return new OBJECT_FOR_TREE(id);
    };

    this.getMortonNumber = function (l, t, r, b) {
        return getMortonNumber.call(this, l, t, r, b);
    };
    this.getPointElem = function (x, y) {
        return getPointElem.call(this, x, y);
    };

    this.__defineGetter__('objectNum', function () { return objectNum; });

}