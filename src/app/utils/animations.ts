export function easeInOutCubic(x: number) {
    return x < 0.5
        ? 4 * x * x * x
        : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

export function animateEasing(
    time: number,
    start: number,
    end: number,
    duration: number,
    easing: (x: number) => number
) {
    if (time > duration) return end;
    return start + (end - start) * easing(time / duration);
}