export function ComingSoon({ title }: { title: string }) {
  return (
    <section className="py-16">
      <h1 className="text-title uppercase">{title}</h1>
      <p className="mt-4 text-body text-gray-600">준비 중입니다.</p>
    </section>
  );
}
