// import { NavLink } from "@mantine/core";
// import { Outlet } from "react-router-dom";
import { Location, useNavigate } from "react-router-dom";
import { Tabs } from "@mantine/core";
import { IconChevronLeft, IconCalendarMonth } from "@tabler/icons-react";

export default function Navigation({ location }: { location: Location }) {
  // const location = useLocation();
  const navigate = useNavigate();
  return (
    <>
      <Tabs
        value={location.pathname}
        onChange={(pathvalue) => {
          navigate(pathvalue!);
        }}
        // style={{ display: location.pathname === "/" ? "none" : "block" }}
      >
        <Tabs.List justify="center">
          <Tabs.Tab value="/">
            <IconChevronLeft />
          </Tabs.Tab>
          {/* <ActionIcon variant="default" aria-label="Back" className="self-end">
            <IconChevronLeft />
          </ActionIcon> */}
          <Tabs.Tab value="/chart">Chart</Tabs.Tab>
          <Tabs.Tab value="/vedic">Vedic</Tabs.Tab>
          <Tabs.Tab value="/bazi">Bazi</Tabs.Tab>
          <Tabs.Tab value="/calendar">
            <IconCalendarMonth />
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>
    </>
  );
}
