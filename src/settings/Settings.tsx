import { Tabs } from "@mantine/core";
import ChartGeneralSettings from "./chart-settings/General";
import ChartDisplaySettings from "./chart-settings/Display";
import ExplainDisplay from "./chart-settings/ExplainDisplay";
// import classes from "./Setting.module.css";
export default function Settings() {
  return (
    <Tabs defaultValue="general">
      <Tabs.List>
        <Tabs.Tab value="general">General</Tabs.Tab>
        <Tabs.Tab value="display" rightSection={<ExplainDisplay />}>
          Display
        </Tabs.Tab>
        {/* <Tabs.Tab value="points">Points</Tabs.Tab>
              <Tabs.Tab value="asteroids">Asteroids</Tabs.Tab> */}
        {/* <Tabs.Tab value="fixed">Fixed Stars</Tabs.Tab> */}
        {/* <Tabs.Tab value="advanced">Advanced</Tabs.Tab> */}
      </Tabs.List>
      <Tabs.Panel value="general">
        <ChartGeneralSettings />
      </Tabs.Panel>
      <Tabs.Panel value="display">
        <ChartDisplaySettings />
      </Tabs.Panel>
    </Tabs>
  );
}
