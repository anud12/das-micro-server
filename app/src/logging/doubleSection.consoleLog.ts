export const doubleSectionConsoleLog = {
  start: (text: string, nonPrefixedText?: string): string => {
    let lines = [];
    lines.push("╒".padEnd(text.length + 5, "═"));
    lines.push(`│  ${text}`)
    if(nonPrefixedText) {
      lines.push(nonPrefixedText.split("\n")
        .map(e => `     ${e}`)
        .join("\n")
      )
    }
    return lines.join("\n")
  },
  line: (text: string, nonPrefixedText?: string): string => {
    let lines = [];
    lines.push(`│  ${text}`);
    if(nonPrefixedText) {
      lines.push(nonPrefixedText.split("\n")
        .map(e => `     ${e}`)
        .join("\n")
      )
    }
    return lines.join("\n")
  },
  strike: (text: string, nonPrefixedText?: string): string => {
    let lines = [];
    lines.push(`╞═ ${text} ═`);
    if(nonPrefixedText) {
      lines.push(nonPrefixedText.split("\n")
        .map(e => `     ${e}`)
        .join("\n")
      )
    }
    return lines.join("\n")
  },
  close: (text: string) => "╘".padEnd(text.length + 5, "═")
}