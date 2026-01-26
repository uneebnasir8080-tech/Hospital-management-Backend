// checking weekdays from date

export const weekDays = (date) => {
  const days = ["mon", "tue", "wed", "thur", "fri", "sat", "sun"];
  return days[new Date(date).getDay()];
};

// normalized date 
export const normalizeDate = (date) => {
return new Date(date + "T00:00:00.000Z");
};