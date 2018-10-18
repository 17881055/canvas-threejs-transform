/**
 * @author ethan
 * @description canvas three.js快捷封装库
 *
 */

var Anna = function() {
  this._width = 200;
  this._height = 200;
  this._three = {
    scene: null,
    camera: null,
    renderer: null,
    light: null,
    stats: null
  };
  this._renderCallback = null;
  //
  this._initCanvas = function() {
    // canvas配置
    var w = this._width;
    var h = this._height;

    this._three.stats = this._initStats('fps');
    //threejs
    var scene = (this._three.scene = new THREE.Scene()); //场景
    var camera = (this._three.camera = new THREE.PerspectiveCamera(
      45,
      w / h,
      1,
      5000
    )); //透视投影相机,fov视角、宽高比、近和远两个视截面

    // 渲染器
    var renderer = (this._three.renderer = new THREE.WebGLRenderer({
      alpha: true
    }));

    renderer.setClearColor();
    renderer.setSize(w, h);
    renderer.shadowMapEnabled = false;

    //debug
    // scene.add(new THREE.AxisHelper(50));
    var light = (this._three.light = new THREE.AmbientLight(0xffffff));
    light.castShadow = true;
    scene.add(light);
    //

    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 800;
    camera.lookAt(scene.position);

    //
    $('#canvas_warp').append(renderer.domElement);
    setTimeout(this._render(), 0);
  };

  //初始化FPS性能状态显示框
  this._initStats = function(elementId) {
    var stats = new Stats();
    stats.setMode(0); // 0: fps, 1: ms
    $('#' + elementId).append(stats.domElement);
    return stats;
  };

  //addLinstener
  this.addListener = function() {
    if (window) return;
    window.addEventListener('resize', this._handleResize);
  };

  this._handleResize = function() {
    if (window) {
      this._three.renderer.setSize(window.innerWidth, window.innerHeight);
    } else {
      console.log('window error');
    }
  };

  this._render = function(e) {
    if (this._three.stats) {
      this._three.stats.update();
    }

    if (this._renderCallback) {
      this._renderCallback(e);
    }

    this._three.renderer.render(this._three.scene, this._three.camera);
    requestAnimationFrame(this._render);
  }.bind(this);
};

/**
 * @param width {Number} canvas 宽度
 * @param height  {Number} canvas 高度
 */
Anna.prototype.start = function(width = 200, height = 200) {
  this._width = width;
  this._height = height;
  this._initCanvas();
};
/**
 * @param cb {Function} //回调
 */
Anna.prototype.onRender = function(cb) {
  this._renderCallback = cb;
};

Object.defineProperty(Anna.prototype, 'scene', {
  get: function() {
    return this._three.scene;
  },
});

Object.defineProperty(Anna.prototype, 'camera', {
  get: function() {
    return this._three.camera;
  },
});
