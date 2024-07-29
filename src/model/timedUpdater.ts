export class TimedUpdater<T> {
  private _lastUpdate: number | undefined;

  private _currentValue: T | undefined;

  private _isUpdating: boolean = false;
  constructor(
    private _interval: number,
    private updateFn: (prev: T | undefined) => Promise<T>,
    startingValue: T | undefined = undefined
  ) {
    this._currentValue = startingValue;
  }

  get currentValue(): T | undefined {
    return this._currentValue;
  }

  get isBackgroundUpdating(): boolean {
    return this._isUpdating;
  }
  //Stores T and returns T
  public async update(): Promise<T> {
    this._lastUpdate = Date.now();
    this._currentValue = await this.updateFn(this._currentValue);
    return this._currentValue;
  }

  // public async updateBackground(callback: (value: T) => void): Promise<void> {
  //   try {
  //     this._isUpdating = true;
  //     var value = await this.update();
  //     callback(value);
  //   } finally {
  //     this._isUpdating = false;
  //   }
  // }

  get needsUpdate(): boolean {
    return (
      !this._isUpdating &&
      (this._lastUpdate === undefined || Date.now() - this._lastUpdate > this._interval)
    );
  }
}
