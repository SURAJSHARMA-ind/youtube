export function isoToDuration(iso: string): string {
    let hours = 0, mins = 0, secs = 0;
    iso.replace(/PT(\d+H)?(\d+M)?(\d+S)?/, (_, h, m, s) => {
      if (h) hours = parseInt(h);
      if (m) mins = parseInt(m);
      if (s) secs = parseInt(s);
      return "";
    });
    const pad = (n: number) => (n < 10 ? "0" + n : "" + n);
    return hours ? `${hours}:${pad(mins)}:${pad(secs)}` : `${mins}:${pad(secs)}`;
  }
  