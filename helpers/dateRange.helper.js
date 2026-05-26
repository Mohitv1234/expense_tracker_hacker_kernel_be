const getDateRange = (type = "week") => {
  const now = new Date();

  let startDate;
  let endDate = new Date();
  endDate.setDate(now.getDate() + 1);
  switch (type) {
    case "today":
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      break;

    case "week":
      startDate = new Date();

      startDate.setDate(now.getDate() - 6);

      break;

    case "month":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);

      break;

    case "year":
      startDate = new Date(now.getFullYear(), 0, 1);

      break;

    default:
      startDate = new Date();
      startDate.setDate(now.getDate() - 6);
  }

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  return {
    start_date: formatDate(startDate),
    end_date: formatDate(endDate),
  };
};

module.exports = getDateRange;
