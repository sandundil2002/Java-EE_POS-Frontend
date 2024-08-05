document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  const timer = document.getElementById("time-lbl");
  const date = document.getElementById("date-lbl");

  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });

  getDate(date);
  getTime(timer);
  setInterval(() => getTime(timer), 1000);
});

$(document).ready(function () {
  $("#dash-btn").addClass("active");

  $(".icon-button").click(function () {
    $(".icon-button").removeClass("active");
    $(this).addClass("active");
  });
});

$(".icon-button").click(function (event) {
  event.preventDefault();
  // $("#dashboard-body").hide();

  const clickedbtn = $(this).attr("id");

  switch (clickedbtn) {
    case "dash-btn":
      $("#dashboard-body").show();
      break;
    case "dash-app-btn":
      break;
    default:
      break;
  }
})