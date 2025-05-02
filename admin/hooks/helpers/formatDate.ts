export const formatDate = (isoDateString: string) => {
  const date = new Date(isoDateString);

  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Jakarta",
  };

  return `${date.toLocaleString("en-GB", options)} WIB`;
};

  