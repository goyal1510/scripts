import { mkdirSync, createWriteStream } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

export function createLogger(importMetaUrl, description) {
  const scriptDir = dirname(fileURLToPath(importMetaUrl));
  const logsDir = join(scriptDir, "logs");
  mkdirSync(logsDir, { recursive: true });

  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const time = now.toISOString().slice(11, 19).replace(/:/g, "");
  const fileName = `${date}_${time}_${description}.log`;

  const stream = createWriteStream(join(logsDir, fileName));
  const originalLog = console.log;
  const originalError = console.error;

  console.log = (...args) => {
    const line = args.join(" ");
    originalLog(...args);
    stream.write(line + "\n");
  };

  console.error = (...args) => {
    const line = args.join(" ");
    originalError(...args);
    stream.write("[ERROR] " + line + "\n");
  };

  return {
    close() {
      stream.end();
      console.log = originalLog;
      console.error = originalError;
    },
  };
}
