# Peggle AI MCP Server

This MCP server allows an AI to play Peggle by capturing the screen and controlling the mouse.

## Tools

- `capture_screen`: Captures the primary monitor and returns the image as base64.
- `click_at(x, y)`: Moves the mouse to (x, y) and performs a left click.

## How to use with LM Studio

1. **Build the server**:
   ```bash
   npm install && npm run build
   ```
2. **Configure LM Studio**:
   - Open LM Studio and go to the **MCP** tab.
   - Click **Add Server**.
   - Set the command to `node` (ensure node is in your PATH).
   - Set the arguments to the absolute path of the built `index.js`, for example:
     `C:\Users\{youruser}\peggle-ai-mcp\dist\index.js`
   - Alternatively, use `npx`:
     - Command: `npx`
     - Arguments: `-y C:\Users\maxwe\Desktop\peggle-ai-mcp`

3. **Start Playing**:
   - Open Peggle (make sure it's on your primary monitor).
   - In LM Studio, select a model that supports vision and tools (e.g., Ministral 3B, or any other vision-capable model).
   - Ask the AI: "Take a screenshot of Peggle, analyze where the best shot is, and click there."

## Implementation Details

- **Screen Capture**: Uses `screenshot-desktop`.
- **Mouse Control**: Uses PowerShell commands via `child_process` for cross-platform compatibility on Windows without needing native build tools.
- **Protocol**: Model Context Protocol (MCP).

## Note on Windows 11

Ensure that PowerShell execution policy allows running the commands if you encounter issues. The server uses standard PowerShell calls that should work in most default configurations.
