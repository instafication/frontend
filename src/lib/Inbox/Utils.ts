
function generateRandomUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function unixTimeStampToDateString(timestamp: bigint): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
}

function DateTimeStringToUnixTimeStamp(datetime: string): bigint {
  const date = new Date(datetime);
  return BigInt(date.getTime() / 1000);
}

function getMinutesDiffFromUnixTimestamp(unixTimestamp: bigint): number {

  const unixTimestamp1 = Number(unixTimestamp);
  const unixTimestampNow = Date.now();
  const diffMilliseconds = unixTimestampNow - unixTimestamp1;
  const diffSeconds = diffMilliseconds / 1000;
  const diffMinutes = diffSeconds / 60;
  return Math.floor(diffMinutes);

}


export {
  generateRandomUUID,
  getMinutesDiffFromUnixTimestamp,
  DateTimeStringToUnixTimeStamp,
  unixTimeStampToDateString,
}