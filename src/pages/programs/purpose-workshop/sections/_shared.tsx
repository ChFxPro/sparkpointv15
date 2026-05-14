import { useEffect, useRef, useState, type ComponentPropsWithoutRef, type ElementType, type ReactNode } from "react";

export type RevealProps<T extends ElementType = "div"> = {
  as?: T;
  className?: string;
  delay?: number;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

export type SectionIntroProps = {
  eyebrow: string;
  title: string;
  description?: string;
  centered?: boolean;
  invert?: boolean;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
};

export function CTAButton({
  href,
  children,
  className = "",
  variant = "primary",
  ariaLabel,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "light";
  ariaLabel?: string;
}) {
  const variants = {
    primary:
      "bg-spark-rose text-white hover:brightness-105 active:brightness-95 focus-visible:outline-spark-rose",
    secondary:
      "bg-white/86 text-spark-ink ring-1 ring-spark-rose/12 hover:bg-white focus-visible:outline-spark-rose",
    light:
      "bg-white text-spark-ink hover:bg-white/92 active:bg-white/84 focus-visible:outline-white",
  } as const;
  const isExternal = /^https?:\/\//.test(href);

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
      aria-label={ariaLabel}
      className={[
        "inline-flex items-center justify-center rounded-full px-7 py-3.5 text-[0.82rem] font-semibold uppercase tracking-[0.1em] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-4",
        "shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.18)]",
        "hover:-translate-y-px active:translate-y-0",
        variants[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </a>
  );
}

export function Reveal<T extends ElementType = "div">({
  as,
  className = "",
  delay = 0,
  children,
  ...props
}: RevealProps<T>) {
  const Component = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReduceMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      setVisible(true);
      return undefined;
    }

    const node = ref.current;
    if (!node) {
      return undefined;
    }

    const revealTimer = window.setTimeout(() => {
      setVisible(true);
    }, 1400);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          window.clearTimeout(revealTimer);
          observer.disconnect();
        }
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    observer.observe(node);

    return () => {
      window.clearTimeout(revealTimer);
      observer.disconnect();
    };
  }, [reduceMotion]);

  return (
    <Component
      ref={ref}
      className={["reveal", visible ? "is-visible" : "", className]
        .filter(Boolean)
        .join(" ")}
      style={reduceMotion ? undefined : { transitionDelay: `${delay}ms` }}
      {...props}
    >
      {children}
    </Component>
  );
}

export function SectionIntro({
  eyebrow,
  title,
  description,
  centered = false,
  invert = false,
  className = "",
  titleClassName = "",
  descriptionClassName = "",
}: SectionIntroProps) {
  return (
    <div
      className={[
        centered ? "mx-auto max-w-3xl text-center" : "max-w-[44rem]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={["flex items-center gap-3", centered ? "justify-center" : ""].filter(Boolean).join(" ")}>
        <span className={["h-px w-10", invert ? "bg-[#FDB515]/70" : "spark-divider"].join(" ")} />
        <span className={["spark-kicker", invert ? "text-[#FDB515]" : "text-spark-rose"].join(" ")}>
          {eyebrow}
        </span>
      </div>

      <h2
        className={[
          "spark-section-title mt-4 leading-[1.01] tracking-[-0.032em]",
          "max-w-[34rem] text-[clamp(2rem,5.2vw,3.1rem)]",
          invert ? "text-white" : "text-spark-ink",
          titleClassName,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {title}
      </h2>

      {description ? (
        <p
          className={[
            "spark-lead mt-4 max-w-[34rem]",
            centered ? "mx-auto" : "",
            invert ? "text-white/70" : "text-spark-soft",
            descriptionClassName,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
