function getTime(timerElement) {
  let t = new Date().toLocaleTimeString();
  timerElement.textContent = t;
}

function getDate(dateElement) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  let now = new Date();
  let dayName = days[now.getDay()];
  let day = now.getDate();
  let monthName = months[now.getMonth()];
  let year = now.getFullYear();

  let formattedDate = `${dayName}(${day})-${monthName}-${year}`;
  dateElement.textContent = formattedDate;
}
