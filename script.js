import { generateXiBody, generateUFOBody } from "./models/index.js";

const main = () => {
  window.addEventListener("DOMContentLoaded", () => {
    const { Engine, Render, Runner, Bodies, Composite, Mouse, Events, Body } =
      Matter;

    // 创建物理引擎
    const engine = Engine.create();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const wrapper = document.querySelector(".matter");
    const stopButton = document.querySelector(".stop_btn");
    let rainingFlag = true;
    // 标志变量，控制是否启用反重力
    let isFloating = true;

    // 创建渲染器
    const render = Render.create({
      element: wrapper,
      engine,
      options: {
        width: windowWidth,
        height: windowHeight,
        background: "transparent",
        wireframeBackground: "transparent",
        wireframes: false,
      },
    });

    // 创建地面和墙体
    const ground = Bodies.rectangle(
      windowWidth / 2,
      windowHeight,
      windowWidth,
      20,
      {
        isStatic: true,
        render: {
          fillStyle: "transparent",
          strokeStyle: "transparent",
        },
      }
    );

    const wallHeight = windowHeight / 4;

    const wall1 = Bodies.rectangle(
      0,
      windowHeight - wallHeight / 2,
      20,
      wallHeight,
      {
        isStatic: true,
        render: {
          fillStyle: "transparent",
          strokeStyle: "transparent",
        },
      }
    );

    const wall2 = Bodies.rectangle(
      windowWidth + 10,
      windowHeight - wallHeight / 2,
      20,
      wallHeight,
      {
        isStatic: true,
        render: {
          fillStyle: "rgba(0,0,0,0.5)",
          strokeStyle: "transparent",
        },
      }
    );

    Composite.add(engine.world, [ground, wall1, wall2]);
    let UFO = generateUFOBody();
    Composite.add(engine.world, [UFO]);

    Matter.Events.on(engine, "beforeUpdate", () => {
      if (isFloating) {
        Matter.Body.applyForce(UFO, UFO.position, {
          x:
            UFO.position.x > windowWidth / 2
              ? -UFO.mass / 2000
              : UFO.mass / 2000,
          y: -UFO.mass / 1000,
        });
      }
    });

    // 检测碰撞事件
    Matter.Events.on(engine, "collisionStart", (event) => {
      const pairs = event.pairs;

      pairs.forEach((pair) => {
        // 判断是否是 UFO 参与的碰撞
        if (pair.bodyA === UFO || pair.bodyB === UFO) {
          // 碰撞发生，停止反重力
          isFloating = false;
        }
      });
    });

    // 每秒生成一个随机圆形物体
    setInterval(() => {
      if (!rainingFlag) return;
      const ball = generateXiBody();
      Composite.add(engine.world, [ball]);
    }, 1000);

    // 鼠标控制逻辑
    let bodyM = Bodies.circle(0, 0, 20, {
      isStatic: true,
      render: {
        fillStyle: "rgba(255, 0, 0, 0.5)",
      },
    });
    Composite.add(engine.world, bodyM);

    // Remove all bodies from the world when needed
    const removeAllBodies = () => {
      rainingFlag = false;
      isFloating = false;
      Composite.remove(engine.world, [ground, wall1, wall2]);
    };

    const startRaining = () => {
      Composite.clear(engine.world);
      UFO = generateUFOBody();
      Composite.add(engine.world, [ground, wall1, wall2, UFO, bodyM]);
      isFloating = true;
      rainingFlag = true;
    };

    stopButton.addEventListener("click", () => {
      if (!rainingFlag) {
        stopButton.innerText = "clear";
        stopButton.style.backgroundColor = "#ff0000";
        startRaining();
      } else {
        stopButton.innerText = "start";
        stopButton.style.backgroundColor = "#00ff00";
        removeAllBodies();
      }
    });

    // Store mouse position
    let mousePosition = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    // Listen to mousemove event to track mouse position
    window.addEventListener("mousemove", (event) => {
      mousePosition.x = event.clientX;
      mousePosition.y = event.clientY;
    });

    // Update bodyM position based on the mouse position
    Events.on(engine, "afterUpdate", () => {
      if (bodyM) {
        Body.setPosition(bodyM, {
          x: mousePosition.x,
          y: mousePosition.y,
        });
      }
    });

    // 启动渲染器和物理引擎
    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);
  });
};

export default main;
