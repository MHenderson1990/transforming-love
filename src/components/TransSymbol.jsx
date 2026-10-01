function TransSymbol({ className = '', title, strokeWidth = 7 }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="butt"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {/* ring */}
      <circle cx="50" cy="58" r="16" />

      {/* right arrow (male) */}
      <path d="M61.3 46.7 L80 28" />
      <path d="M90 18 L73 21 L87 35 Z" fill="currentColor" stroke="none" />

      {/* left arrow with crossbar */}
      <path d="M38.7 46.7 L20 28" />
      <path d="M10 18 L27 21 L13 35 Z" fill="currentColor" stroke="none" />
      <path d="M34 30 L22 42" />

      {/* cross (female) */}
      <path d="M50 74 V98 M41 88 H59" />
    </svg>
  )
}

export default TransSymbol