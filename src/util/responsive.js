
export const _cssWidthPercent = 0.8
export const _cssWidthMin = 800

export const viewPort = () => {
    return window.innerWidth < _cssWidthMin
        ? window.innerWidth - 5
        : window.innerWidth * _cssWidthPercent
}