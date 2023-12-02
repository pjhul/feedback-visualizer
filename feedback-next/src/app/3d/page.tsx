"use client";
import data from "./sample-data.json";

import PointsComponent from "./PointsComponent";

export default function Test() {
  const points = data;

  return (
    <div>
      <PointsComponent points={points} />
    </div>
  );
}
