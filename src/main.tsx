import React from "react";
import ReactDOM from "react-dom/client";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";

// import App from "./App.tsx";
import ErrorPage from "./routes/ErrorPage";
import Vedic from "./routes/Vedic";
import Bazi from "./routes/Bazi";
import Chart from "./routes/Chart";
import Entry from "./routes/Entry";
import Root from "./routes/Root";
import Calendar from "./routes/Calendar";
import "@mantine/core/styles.css";
import "./index.css";

import {
  Button,
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

const theme = createTheme({
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
});
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <RouterProvider router={router} />
    </MantineProvider>
  </React.StrictMode>
);
