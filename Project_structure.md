### Project Structure

## Electron
- renderer: for rendering pages.
- main: electron application.

## Global States
- /renderer/stores/atoms.ts: defines all atom hookers.
- /renderer/stores/

## AI Model Interface

The AI model interface handles the interaction between different AI models and applications. It provide functions, such as *chat()*,  *paint_picture()*, for further usages. It also automatically maintain the data structure of models.

The Chat *Base* class in /renderer/packages/models/base.ts provides following functions:

- *async chat(message,onResultUpdated)*: It provides  

- *async _chat(message,onResultUpdated)*: It provides  