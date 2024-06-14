export function removeWordSuffix(name) {
    const suffix = '.testnet';
    if (name.endsWith(suffix)) {
        return name.slice(0, -suffix.length);
    }
    return name
}