export function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-px" role="img" aria-label={`별점 ${rating}점`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" className={n <= Math.round(rating) ? 'text-black' : 'text-gray-200'}>
          <path fill="currentColor" d="M6 .5l1.7 3.7 4 .4-3 2.7.9 4L6 9.2 2.4 11.3l.9-4-3-2.7 4-.4z" />
        </svg>
      ))}
    </span>
  );
}
