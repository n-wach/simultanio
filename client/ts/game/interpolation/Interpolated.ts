export default abstract class Interpolated<T> {
    valid: boolean = true;
    abstract interpolate(dt: number);
    sync(ref: T) {
        this.valid = true;
    }
}
