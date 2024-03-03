import { Button } from "@mantine/core";
import { Link, useRouteError } from "react-router-dom";
export default function ErrorPage() {
  const error: any = useRouteError();
  // console.log("Status", error.status);
  // console.log("obj", error);
  // console.log("message", error.message);

  return (
    <div id="error-page">
      <h1>Error Page</h1>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
      {error.message == "Not Found" && (
        <div>Try again, if the error persists, clear the browser cache.</div>
      )}

      <Button to="/" component={Link}>
        HOME
      </Button>
      <Button href="/tools/index.html" component="a">
        TOOLS
      </Button>
    </div>
  );
}
