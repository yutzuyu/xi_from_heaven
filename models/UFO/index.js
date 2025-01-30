export const generateUFOBody = () => {
  const radius = 80; // 半径范围 [25, 50]
  const xPosition = 10; // 避免生成边界外的物体
  return Matter.Bodies.rectangle(xPosition, 400, radius, radius, {
    frictionAir: 0,
    render: {
      sprite: {
        texture: "素材/img/3DUFO.png",
        xScale: (radius * 2) / 1024,
        yScale: (radius * 2) / 1024,
      },
    },
  });
};
