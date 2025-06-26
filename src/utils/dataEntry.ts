export function handleDataEntry(
  field: string,
  value: string,
  setData: Function
) {
  setData((current: { [key: string]: string }) => {
    return { ...current, [field]: value };
  });
}
