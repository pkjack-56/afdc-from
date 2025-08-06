"use client";

import React, { useRef, useEffect } from "react";

type Props = {
  images: File[];
  message: string;
  date: string;
};

export default function CanvasRenderer({ images, message, date }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bgImage = new Image();
    bgImage.src = "/template.png"; // ✅ ใส่รูปพื้นหลังใน public/template.png

    bgImage.onload = async () => {
      canvas.width = bgImage.width;
      canvas.height = bgImage.height;

      ctx.drawImage(bgImage, 0, 0);

      // วาดวันที่
      ctx.font = "24px 'TH SarabunPSK'";
      ctx.fillStyle = "black";
      ctx.textAlign = "right";
      ctx.fillText(date, canvas.width - 40, 40);

      // วาดรูป 5 รูป
      const positions = [
        [100, 100], [300, 100], [500, 100], [100, 300], [300, 300],
      ];

      for (let i = 0; i < images.length && i < 5; i++) {
        const imgURL = URL.createObjectURL(images[i]);
        const img = new Image();
        await new Promise<void>((resolve) => {
          img.onload = () => {
            ctx.drawImage(img, positions[i][0], positions[i][1], 150, 150);
            URL.revokeObjectURL(imgURL);
            resolve();
          };
          img.src = imgURL;
        });
      }

      // วาดข้อความ
      ctx.font = "28px 'TH SarabunPSK'";
      ctx.fillStyle = "black";
      ctx.textAlign = "left";

      const lines = message.split("\n");
      lines.forEach((line, idx) => {
        ctx.fillText(line, 60, canvas.height - 100 + idx * 32);
      });
    };
  }, [images, message, date]);

  return (
    <div>
      <canvas ref={canvasRef} style={{ border: "1px solid #ccc" }} />
    </div>
  );
}
