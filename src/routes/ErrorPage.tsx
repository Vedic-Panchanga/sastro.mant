import { Button } from "@mantine/core";
import { Link, useRouteError } from "react-router-dom";
export default function ErrorPage() {
  const error: any = useRouteError();
  console.log("Status", error.status);
  console.log("obj", error);
  console.log("message", error.message);

  return (
    <div id="error-page">
      <h1>Error Page</h1>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
      {error.message == "stackSave is not a function" && (
        <p>
          <div>A javascript did not finish loading. </div>
          <div>Reload the home page and wait few seconds before charting.</div>
        </p>
      )}
      <Button to="/" component={Link}>
        HOME
      </Button>
    </div>
  );
}
