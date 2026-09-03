# UbuntuOS static build

This folder is a static, upload-ready build of UbuntuOS.

You do not need `npm`, Vite, `npm run dev`, or `npm run build` to use this copy.

Upload the **contents of this folder** into:

`EtherealOS/ubuntuos/`

The folder should end up looking like:

```
ubuntuos/
  index.html
  app.js
  styles.css
  yaru-mountain-wallpaper.jpg
  icons/
    ...
```

Then the chooser link should be:

```html
<a href="./ubuntuos/"><img src="./images/ubuntu.png" class="os-icon">Ubuntu</a>
```

Note: this static build loads React 18 from unpkg at runtime, so the deployed page needs internet access to start the React app. Your UbuntuOS assets themselves are bundled locally.
