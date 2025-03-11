### Project Structure

## Building Logic
- The whole project is first compiled into web using Webpack. The web is in charge of determining the rendering page for both mobile and desktop. *(This makes the whole developing process sticked to web only)*
- *If* the target platform is Desktop, then Electron is used to pack the web into application.
- *If* the target platform is Mobile, then Capacity is used to pack the web into mobile App.
## Electron
- renderer: for rendering pages.
- main: electron application.

## Global States
- /renderer/stores/atoms.ts: defines all atom hookers.
- /renderer/stores/

## CSS Loader
- This project uses Tailwind css for fast developing.

## WorkFlow Library
- This project uses Go.js as agent workflow library

## UI and Icon Libraries

- UI: mui
- Icon: lucide

## AI Model Interface

The AI model interface handles the interaction between different AI models and applications. It provide functions, such as *chat()*,  *paint_picture()*, for further usages. It also automatically maintain the data structure of models.

The Chat *Base* class in /renderer/packages/models/base.ts provides following functions:

- *async chat(message,onResultUpdated)*: It provides

- *async _chat(message,onResultUpdated)*: It provides