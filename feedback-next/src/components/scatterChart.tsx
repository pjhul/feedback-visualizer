"use client";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Scatter } from "react-chartjs-2";
import response from "@/data/response.json"; // Importing the JSON data

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

export const options = {
  plugins: {
    tooltip: {
      callbacks: {
        label: function (context: any) {
          var label = context.dataset.label || "";

          if (label) {
            label += ": ";
          }
          if (context.raw.Text) {
            // Accessing the Text property of the data point
            label += context.raw.Text;
          }
          return label;
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

export const data = {
  datasets: [
    {
      label: "Product Review",
      data: response, // Using imported data
      backgroundColor: "rgba(255, 99, 132, 1)",
    },
  ],
};

export function Vizi() {
  return (
    <div className="w-full h-full">
      <Scatter data={data} options={options} />
    </div>
  );
}
