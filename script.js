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

  // 每秒生成一个随机圆形物体
  setInterval(() => {
    if (!rainingFlag) return;
    const ball = generateBody();
    Composite.add(engine.world, [ball]);
  }, 500);

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
    Composite.remove(engine.world, [ground, wall1, wall2]);
  };

  const startRaining = () => {
    Composite.clear(engine.world);
    console.log(engine.world.bodies);
    Composite.add(engine.world, [ground, wall1, wall2]);

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

// 随机生成圆形物体
const generateBody = () => {
  const radius = Math.random() * 25 + 25; // 半径范围 [25, 50]
  const xPosition = Math.random() * (window.innerWidth - 50) + 25; // 避免生成边界外的物体
  return Matter.Bodies.circle(xPosition, -20, radius, {
    friction: 0,
    restitution: 0.3,
    frictionAir: 0,
    angle: Math.random() * Math.PI,
    render: {
      sprite: {
        texture: "素材/img/3Dxi.png",
        xScale: (radius * 2) / 1024,
        yScale: (radius * 2) / 1024,
      },
    },
  });
};
