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
// import response from "@/data/response.json"; // Importing the JSON data
import zoomPlugin from "chartjs-plugin-zoom";

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  zoomPlugin
);

export const options = {
  plugins: {
    zoom: {
      zoom: {
        wheel: {
          enabled: true, // Enable zooming with mouse wheel
        },
        pinch: {
          enabled: true, // Enable zooming with pinch gestures
        },
        mode: "xy", // Zoom both axes
      },
      pan: {
        enabled: true, // Enable panning
        mode: "xy", // Pan both axes
      },
    },
    tooltip: {
      callbacks: {
        label: function (context: any) {
          var label = context.dataset.label || "";

          if (label) {
            label += ": ";
          }
          // if (context.raw.text) {
          //   // Accessing the Text property of the data point
          //   label += context.raw.text;
          // }
          // foreach context add it to the label with new line
          return Object.values(context.raw);
          //  label;
        },
      },
    },
  },
  scales: {
    x: {
      ticks: {
        display: false, // Hides the tick labels on the X-axis
      },
    },
    y: {
      ticks: {
        display: false, // Hides the tick labels on the Y-axis
      },
    },
  },
};

export const getDatasets = () => {
  // Grab local storage keys from "datasets" and use them to grab the data from local storage

  const datasetNames = JSON.parse(localStorage.getItem("datasets") || "[]");
  // go to "datasets" and grab the data from local storage
  let datasets = [];
  datasetNames.forEach((dataset: string) => {
    const data = JSON.parse(localStorage.getItem(dataset) || "[]");
    console.log("data", data);
    // add data to the chart
    datasets.push({
      label: dataset,
      data: data,
      // random color
      backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    });
  });
  return datasets;
};

export const data = {
  datasets: [
    // {
    //   label: "Scatter Dataset",
    //   data: response,
    //   backgroundColor: "rgb(255, 99, 132)",
    // },
    ...getDatasets(),
  ],
};

export function Vizi() {
  return (
    <div className="w-full h-full">
      <Scatter data={data} options={options} />
    </div>
  );
}
