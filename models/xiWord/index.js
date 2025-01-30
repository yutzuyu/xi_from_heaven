export const generateXiBody = () => {
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
