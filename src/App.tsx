import React from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  // useParams,
} from "react-router-dom";

// import App from "./App.tsx";
import ErrorPage from "./routes/ErrorPage";
import Vedic from "./vedic-components/Vedic";
import Bazi from "./bazi-components/Bazi";
import Chart from "./chart-components/Chart";
import Entry from "./routes/Entry";
import Root from "./routes/Root";
import Calendar from "./calendar-components/Calendar";
import "@mantine/core/styles.css";
import "./index.css";

import {
  Button,
  CSSVariablesResolver,
  MantineProvider,
  Table,
  Tooltip,
  createTheme,
} from "@mantine/core";
const router = createBrowserRouter(
  createRoutesFromElements(
    // hook: store time/location; transit time/location
    <Route path="/" element={<Root />} errorElement={<ErrorPage />}>
      {/* entry:set time/location */}
      <Route index element={<Entry />}></Route>
      {/* calc and display */}
      <Route path="chart" element={<Chart />} />
      <Route path="bazi" element={<Bazi />} />
      <Route path="vedic" element={<Vedic />} />
      <Route path="calendar" element={<Calendar />} />
    </Route>
  )
);

const resolver: CSSVariablesResolver = (theme) => ({
  variables: {
    "--mantine-color-fire": theme.other.colorFire,
    "--mantine-color-earth": theme.other.colorEarth,
    "--mantine-color-air": theme.other.colorAir,
    "--mantine-color-water": theme.other.colorWater,
  },
  light: {},
  dark: {},
});
export default function App() {
  const themeOverride = createTheme({
    fontFamily:
      "astro,-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, sans-serif",
    activeClassName: "",
    components: {
      Button: Button.extend({
        defaultProps: {
          size: "xs",
          // variant: 'outline',
        },
      }),

      Tooltip: Tooltip.extend({
        defaultProps: {
          events: { hover: true, focus: true, touch: true },
          // variant: 'outline',
          // multiline: true,
          // w: 200,
          withArrow: true,
          transitionProps: { duration: 200 },
        },
      }),
      Table: Table.extend({
        styles: {
          th: { textAlign: "center" },
        },
      }),
    },
    other: {
      colorFire: " #cc0000",
      colorEarth: "#f1c232",
      colorAir: "#3d85c6",
      colorWater: "#6aa84f",
    },
  });
  return (
    <React.StrictMode>
      <MantineProvider theme={themeOverride} cssVariablesResolver={resolver}>
        <RouterProvider router={router} />
      </MantineProvider>
    </React.StrictMode>
  );
}
