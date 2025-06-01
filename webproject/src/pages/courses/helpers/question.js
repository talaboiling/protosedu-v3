export function getFontSize(length, scale=1) {
    if (length <= 36) return 27*scale;
    if (length <= 54) return 24*scale;
    if (length <= 72) return 21*scale;
    if (length <= 84) return 18*scale;
    if (length <= 112) return 15*scale;
    return 12*scale;
}