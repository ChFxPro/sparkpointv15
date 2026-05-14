import type { ReactNode, CSSProperties } from "react";
import type { ProgramVoice } from "../programsData";
import "./ProgramShell.css";

interface ProgramShellProps {
  voice: ProgramVoice;
  accent?: string;
  accentSoft?: string;
  children: ReactNode;
}

export function ProgramShell({ voice, accent, accentSoft, children }: ProgramShellProps) {
  const style: CSSProperties & Record<string, string> = {};
  if (accent) style["--program-accent"] = accent;
  if (accentSoft) style["--program-accent-soft"] = accentSoft;

  return (
    <div className="program-shell" data-voice={voice} style={style}>
      {children}
    </div>
  );
}
