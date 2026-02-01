export function getInitials(name: string): string {
  if (name.includes(" ")) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  } else {
    return name.slice(0, 2).toUpperCase();
  }
}
