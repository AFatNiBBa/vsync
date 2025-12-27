
// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";

export default createHandler(() => 
  <StartServer
    document={({ assets, children, scripts }) =>
      <html lang="it">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="description" content="Robe di utilità per Sean :)" />
          <link rel="shortcut icon" href="/logo.svg" />
          {assets}
        </head>
        <body>
          {children}
          {scripts}
        </body>
      </html>
    }
  />
);