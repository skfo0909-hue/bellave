import { ButtonLink } from './Button';

export function EmptyState({ message, href, cta }: { message: string; href?: string; cta?: string }) {
  return (
    <div className="flex flex-col items-center py-30 text-center">
      <p className="text-body text-gray-600">{message}</p>
      {href && cta && (
        <div className="mt-6">
          <ButtonLink href={href} variant="secondary">
            {cta}
          </ButtonLink>
        </div>
      )}
    </div>
  );
}
