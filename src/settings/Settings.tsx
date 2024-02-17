import { Tabs } from "@mantine/core";
import ChartGeneralSettings from "./chart-settings/General";
import ChartDisplaySettings from "./chart-settings/Display";
// import classes from "./Setting.module.css";
export default function Settings({ defaultTab }: { defaultTab: string }) {
  return (
    <Tabs defaultValue={defaultTab}>
      <Tabs.List>
        <Tabs.Tab value="chart">Chart</Tabs.Tab>
        <Tabs.Tab value="vedic">Vedic</Tabs.Tab>
        <Tabs.Tab value="bazi">Bazi</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="chart">
        <Tabs defaultValue="general">
          <Tabs.List>
            <Tabs.Tab value="general">General</Tabs.Tab>
            <Tabs.Tab value="display">Display</Tabs.Tab>
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
      </Tabs.Panel>
      <Tabs.Panel value="vedic">vedic</Tabs.Panel>
      <Tabs.Panel value="bazi">bazi</Tabs.Panel>
    </Tabs>
  );
}
