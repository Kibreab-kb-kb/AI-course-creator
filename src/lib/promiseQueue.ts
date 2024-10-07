type PromiseGenerator = () => Promise<any>;

export class PromiseQueue {
  private maxConcurrent: number;
  private currentCount: number;
  private queue: Array<{
    promiseGenerator: PromiseGenerator;
    resolve: (value?: any) => void;
    reject: (reason?: any) => void;
  }>;

  constructor(maxConcurrent: number) {
    this.maxConcurrent = maxConcurrent;
    this.currentCount = 0;
    this.queue = [];
  }

  // Add a new promise generator to the queue
  add(promiseGenerator: PromiseGenerator): Promise<any> {
    return new Promise((resolve, reject) => {
      this.queue.push({
        promiseGenerator,
        resolve,
        reject,
      });
      this.tryNext();
    });
  }

  // Try to run the next promise if the concurrency limit is not reached
  private tryNext(): void {
    if (this.currentCount < this.maxConcurrent && this.queue.length) {
      const { promiseGenerator, resolve, reject } = this.queue.shift()!;
      this.currentCount++;
      promiseGenerator()
        .then(resolve, reject)
        .finally(() => {
          this.currentCount--;
          this.tryNext();
        });
    }
  }
}
