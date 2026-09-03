# UbuntuOS React Yaru-style v6

This pass uses a local scenic wallpaper and real clickable React dock buttons. Third-party brand marks (Brave, OpenAI/ChatGPT, Gemini, YouTube, Reddit, WhatsApp, Steam, Discord, VS Code, Google Docs, Telegram) are loaded from Simple Icons CDN so they are the actual brand SVGs rather than hand-drawn approximations. The system icons remain local.

For a fully offline build, download those SVGs from Simple Icons and place them in `public/icons/`, then change `BrandIcon` in `src/main.jsx` to use local files.

Yaru reference: the Ubuntu Yaru project publishes its icon sources as SVGs and documents the Yaru/Sur​​u icon design approach. See https://github.com/ubuntu/yaru
