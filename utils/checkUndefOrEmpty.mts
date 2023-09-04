export default function checkUndefOrEmpty(value: string | undefined) {
  if (value == undefined || value == "") return true;
  return false;
}
