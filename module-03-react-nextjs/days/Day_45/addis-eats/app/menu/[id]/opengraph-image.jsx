import { getDish } from "@/lib/dishes";
import { ImageResponse } from "next/og";
import fs from "fs/promises";
import path from "path";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({ params }) {
  const { id } = await params;
  const dish = await getDish(id);

  if (!dish) {
    return new ImageResponse(
      <div
        style={{
          display: "flex",
          fontSize: 60,
        }}
      >
        Dish not found
      </div>,
      size
    );
  }

  const imagePath = path.join(
    process.cwd(),
    "public",
    dish.image
  );

  const imageBuffer = await fs.readFile(imagePath);
  const base64Image = imageBuffer.toString("base64");
  const imageSrc = `data:image/png;base64,${base64Image}`;

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        height: "100%",
        background: "#F2E8D5",
        padding: "50px",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "500px",
          height: "500px",
        }}
      >
        <img
          src={imageSrc}
          width={500}
          height={500}
        />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "550px",
          height: "500px",
          marginLeft: "50px",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 64,
            fontWeight: 700,
          }}
        >
          {dish.name}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 42,
            fontWeight: 700,
            color: "#176B4D",
            marginTop: "20px",
          }}
        >
          {dish.price} ETB
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#666",
            marginTop: "20px",
          }}
        >
          {dish.description}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 30,
            fontWeight: 700,
            marginTop: "40px",
          }}
        >
          ADDIS EATS
        </div>
      </div>
    </div>,
    size
  );
}