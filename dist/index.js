import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import screenshot from "screenshot-desktop";
import { z } from "zod";
import { moveAndClick } from "./mouse.js";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const server = new Server({
    name: "peggle-ai-mcp",
    version: "1.0.0",
}, {
    capabilities: {
        tools: {},
    },
});
const ClickAtSchema = z.object({
    x: z.number().describe("X coordinate to click"),
    y: z.number().describe("Y coordinate to click"),
});
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "capture_screen",
                description: "Captures a screenshot of the primary monitor and returns it as a base64 encoded string.",
                inputSchema: {
                    type: "object",
                    properties: {},
                },
            },
            {
                name: "click_at",
                description: "Moves the mouse to the specified coordinates and performs a left click.",
                inputSchema: {
                    type: "object",
                    properties: {
                        x: { type: "number", description: "X coordinate" },
                        y: { type: "number", description: "Y coordinate" },
                    },
                    required: ["x", "y"],
                },
            },
        ],
    };
});
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    switch (request.params.name) {
        case "capture_screen": {
            try {
                const img = await screenshot({ format: 'png' });
                const base64 = img.toString('base64');
                return {
                    content: [
                        {
                            type: "text",
                            text: "Screenshot captured successfully. Here is the base64 data (truncated in logs).",
                        },
                        {
                            type: "image",
                            data: base64,
                            mimeType: "image/png",
                        }
                    ],
                };
            }
            catch (error) {
                return {
                    content: [
                        {
                            type: "text",
                            text: `Failed to capture screenshot: ${error.message}`,
                        },
                    ],
                    isError: true,
                };
            }
        }
        case "click_at": {
            const args = ClickAtSchema.safeParse(request.params.arguments);
            if (!args.success) {
                return {
                    content: [
                        {
                            type: "text",
                            text: `Invalid arguments: ${args.error.message}`,
                        },
                    ],
                    isError: true,
                };
            }
            try {
                await moveAndClick(args.data.x, args.data.y);
                return {
                    content: [
                        {
                            type: "text",
                            text: `Clicked at (${args.data.x}, ${args.data.y})`,
                        },
                    ],
                };
            }
            catch (error) {
                return {
                    content: [
                        {
                            type: "text",
                            text: `Failed to click: ${error.message}`,
                        },
                    ],
                    isError: true,
                };
            }
        }
        default:
            throw new Error(`Unknown tool: ${request.params.name}`);
    }
});
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Peggle AI MCP Server running on stdio");
}
main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
