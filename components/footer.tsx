export default function Footer() {
  return (
    <div className="bg-surface1/80 backdrop-blur-md border-t border-border1 py-6 md:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span className="font-black tracking-tight text-text1">
          Pick<span className="text-main1">One</span>Play
        </span>
        <span className="text-sm text-muted">
          © {new Date().getFullYear()} PickOnePlay
        </span>
      </div>
    </div>
  );
}
