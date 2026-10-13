
export function toCsv(rows) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return "";
  }

  // Quote cells containing commas, quotes, or line breaks.
  function escapeCell(value) {
    const text = String(value ?? "");

    if (/[",\r\n]/.test(text)) {
      return `"${text.replace(/"/g, '""')}"`;
    }

    return text;
  }

  const headers = Object.keys(rows[0]);

  const csvRows = [
    headers,
    ...rows.map((row) => headers.map((header) => row[header])),
  ];

  return csvRows
    .map((row) => row.map(escapeCell).join(","))
    .join("\r\n");
}

export function downloadCsv(rows, filename = "addis-eats-orders.csv") {
  if (!Array.isArray(rows) || rows.length === 0) {
    return false;
  }

  const csv = toCsv(rows);

  // BOM improves UTF-8 compatibility in spreadsheet applications.
  const blob = new Blob(["\uFEFF", csv], {
    type: "text/csv;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);

  return true;
}
