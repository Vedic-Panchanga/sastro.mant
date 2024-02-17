import { useState, ChangeEvent } from "react";
import {
  Button,
  List,
  Divider,
  Modal,
  ActionIcon,
  TextInput,
} from "@mantine/core";
import { API_KEY } from "../config";
import { type SetLocationObj } from "../routes/Root";
import { IconSearch, IconChevronRight } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import classes from "./ModalButtonGeocode.module.css";
const API_BASE = "https://eu1.locationiq.com/v1";

function buildUrl(method: string, params: { [key: string]: string }) {
  return `${API_BASE}/${method}?format=json&key=${API_KEY}&${new URLSearchParams(
    params
  )}`;
}

async function geocode(city: string) {
  const request = buildUrl("search", {
    city,
    limit: "4",
    // "accept-language": "native",
  });
  const res = await fetch(request);
  const data = await res.json();
  return data;
}

// 定义 Geocode 组件的 props 类型
type GeocodeProps = {
  setGeocodeLocation: (longitude: number, latitude: number) => void;
};
function Geocode({ setGeocodeLocation }: GeocodeProps) {
  const [city, setCity] = useState("");
  const [isSearching, setIsSearching] = useState(false); // new state variable
  type LocationInfo =
    | { error: string }
    | Array<{ display_name: string; lon: string; lat: string }>;

  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null);

  async function handleSearch() {
    setIsSearching(true); // start searching
    try {
      const data = await geocode(city);
      // 使用 setState 设置 locationInfo
      setLocationInfo(data);

      setTimeout(() => setIsSearching(false), 2000); // disable searching for 2 seconds
    } catch (error) {
      console.error("Error geocoding:", (error as Error).message);
      return <>{(error as Error).message}</>;
    }
  }
  const handleKeyPress = (e: { key: string }) => {
    // 检查是否按下回车键
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  return (
    <div className={classes.controls}>
      <TextInput
        label="Search for locations"
        placeholder="city/town/address"
        classNames={{ input: classes.input, root: classes.inputWrapper }}
        value={city}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setCity(event.target.value)
        }
        onKeyUp={handleKeyPress}
        rightSection={
          <ActionIcon onClick={handleSearch} disabled={isSearching}>
            <IconSearch />
          </ActionIcon>
        }
      />

      {
        <div>
          {locationInfo &&
            (!Array.isArray(locationInfo) ? (
              <>{locationInfo.error}</>
            ) : (
              <List className={classes.list}>
                {locationInfo.map((locationData, index: number) => (
                  <>
                    {index !== 0 ? <Divider my="4" /> : ""}
                    <List.Item key={index}>
                      <div className={classes["list-item"]}>
                        <div>
                          {locationData.display_name}
                          <div>
                            <span>Lon: </span>
                            {`${parseFloat(locationData.lon).toFixed(3)}; `}
                            <span>Lat: </span>
                            {`${parseFloat(locationData.lat).toFixed(3)}`}
                          </div>
                        </div>
                        <ActionIcon
                          size="sm"
                          onClick={() =>
                            setGeocodeLocation(
                              parseFloat(locationData.lon),
                              parseFloat(locationData.lat)
                            )
                          }
                        >
                          <IconChevronRight />
                        </ActionIcon>
                      </div>
                    </List.Item>
                  </>
                ))}
              </List>
            ))}
        </div>
      }
    </div>
  );
}

export default function ModalButtonGeocode({ setLocation }: SetLocationObj) {
  const [opened, { open, close }] = useDisclosure(false);
  function setGeocodeLocation(longitude: number, latitude: number) {
    setLocation({ longitude, latitude });
    close();
  }
  return (
    <>
      <Button onClick={open} classNames={{ root: classes.search }}>
        Search
      </Button>
      <Modal
        opened={opened}
        onClose={close}
        withCloseButton={false}
        overlayProps={{
          backgroundOpacity: 0.35,
          blur: 4,
        }}
      >
        <Geocode setGeocodeLocation={setGeocodeLocation} />
      </Modal>
    </>
  );
}
