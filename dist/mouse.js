import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);
export async function moveMouse(x, y) {
    const command = `powershell -command "[Reflection.Assembly]::LoadWithPartialName('System.Windows.Forms'); [System.Windows.Forms.Cursor]::Position = New-Object System.Drawing.Point(${x}, ${y})"`;
    await execAsync(command);
}
export async function clickMouse() {
    const command = `powershell -command "$signature = '[DllImport(\\"user32.dll\\")] public static extern void mouse_event(int flags, int dx, int dy, int cButtons, int dwExtraInfo);'; $type = Add-Type -MemberDefinition $signature -Name \\"Win32MouseEvent\\" -Namespace \\"Win32Utils\\" -PassThru; $type::mouse_event(0x0002, 0, 0, 0, 0); $type::mouse_event(0x0004, 0, 0, 0, 0);"`;
    await execAsync(command);
}
export async function moveAndClick(x, y) {
    await moveMouse(x, y);
    // Small delay to ensure mouse moved
    await new Promise(resolve => setTimeout(resolve, 100));
    await clickMouse();
}
