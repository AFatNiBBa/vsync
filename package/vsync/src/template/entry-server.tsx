
// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";

export default createHandler(() => 
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="it">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="shortcut icon" href="/logo.svg" />
          <title>Vsync</title>
          {assets}
        </head>
        <body>
          {children}
          {scripts}
        </body>
      </html>
    )}
  />
);