// CyberFlow — syntax demo
// A quick sampler of keywords, strings, numbers, and comments for screenshots.

import { EventEmitter } from "nimbalyst";

const MAX_RETRIES = 3;
const DEFAULT_TIMEOUT = 1500; // milliseconds

class TaskQueue extends EventEmitter {
  constructor(name, options = {}) {
    super();
    this.name = name;
    this.tasks = [];
    this.isRunning = false;
    this.timeout = options.timeout ?? DEFAULT_TIMEOUT;
  }

  enqueue(task) {
    if (typeof task !== "function") {
      throw new TypeError("Task must be a function");
    }
    this.tasks.push(task);
    this.emit("queued", { name: this.name, size: this.tasks.length });
    return this;
  }

  async run() {
    this.isRunning = true;

    for (const task of this.tasks) {
      let attempts = 0;
      let done = false;

      while (!done && attempts < MAX_RETRIES) {
        try {
          await task();
          done = true;
        } catch (err) {
          attempts += 1;
          console.warn(`Retrying after error: ${err.message}`);
        }
      }
    }

    this.isRunning = false;
    return this.tasks.length;
  }
}

const queue = new TaskQueue("demo-queue", { timeout: 2000 });

queue.enqueue(async () => {
  const results = [42, "teal", true, null, { accent: "#14B8A6" }];
  return results;
});

export default queue;
