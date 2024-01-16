import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export function generateUniqueMeetingId() {
  const uniqueId = uuidv4();
  const shortenedUniqueId = uniqueId
    .replace(/[^a-zA-Z0-9]/g, '')
    .substring(0, 12);
  // Format the shortened unique identifier as '0000-0000-0000'
  const formattedMeetingId = `${shortenedUniqueId.substring(
    0,
    4
  )}-${shortenedUniqueId.substring(4, 8)}-${shortenedUniqueId.substring(
    8,
    12
  )}`;
  console.log('uniqueId', uniqueId, 'length', uniqueId?.length);
  console.log(
    'shortenedUniqueId',
    shortenedUniqueId,
    'length',
    shortenedUniqueId?.length
  );
  console.log(
    'formattedMeetingId',
    formattedMeetingId,
    'length',
    formattedMeetingId?.length
  );

  return formattedMeetingId;
}
